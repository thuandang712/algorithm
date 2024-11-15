# Resource Group
# add some comment here for wizcli integration
# work in test branch for sample PR
resource "azurerm_resource_group" "danglingdns" {
  name     = "danglingdns-azure"
  location = var.default_region
}

# Storage Account for Function App and to store Excel exported files from script
resource "azurerm_storage_account" "danglingdns" {
  # checkov:skip=CKV_AZURE_35: Github actions whitelist limitation.
  # checkov:skip=CKV_AZURE_33: Queue properties don't apply @ the moment
  # checkov:skip=CKV2_AZURE_1: For now, the CMK's are disabled
  # checkov:skip=CKV2_AZURE_18: For now, the CMK's are disabled
  # checkov:skip=CKV2_AZURE_8: This applies to storage containers and not storage accounts.
  # checkov:skip=CKV2_AZURE_33: "Ensure storage account is configured with private endpoint"
  # checkov:skip=CKV2_AZURE_38: "Ensure soft-delete is configured for storage account"
  # checkov:skip=CKV_AZURE_206: "Ensure that Storage Accounts use replication"
  # checkov:skip=CKV_AZURE_190: Ensure that Storage blobs restrict public access (will be enable with Atlantis running on Azure)
  # checkov:skip=CKV_AZURE_59: Ensure that Storage accounts disallow public access (will be enable with Atlantis running on Azure)
  # checkov:skip=CKV2_AZURE_40: Ensure storage account is not configured with Shared Key authorization
  # checkov:skip=CKV2_AZURE_41: Ensure storage account is configured with SAS expiration policy
  name                            = "danglingdnsfunctionsa" # Define the same name in the run.ps1 script
  resource_group_name             = azurerm_resource_group.danglingdns.name
  location                        = azurerm_resource_group.danglingdns.location
  account_tier                    = "Standard"
  account_replication_type        = "LRS"
  min_tls_version                 = "TLS1_2"
  allow_nested_items_to_be_public = false
}

# Application Insights for Function App
resource "azurerm_application_insights" "danglingdns" {
  name                = "danglingdns-functionapp-appinsights"
  location            = azurerm_resource_group.danglingdns.location
  resource_group_name = azurerm_resource_group.danglingdns.name
  application_type    = "other"
  workspace_id        = local.log_analytics_workspace_id
}

# Service Plan for the Function App
resource "azurerm_service_plan" "danglingdns" {
  # checkov:skip=CKV_AZURE_211: "Ensure App Service plan suitable for production use"
  # checkov:skip=CKV_AZURE_212: "Ensure App Service has a minimum number of instances for failover"
  # checkov:skip=CKV_AZURE_225: "Ensure the App Service Plan is zone redundant"
  name                = "danglingdns-functionapp-svcplan"
  location            = azurerm_resource_group.danglingdns.location
  resource_group_name = azurerm_resource_group.danglingdns.name
  os_type             = "Windows"
  sku_name            = "F1" # Create the resource in S1 SKU first, then move it to F1 (Issue https://github.com/hashicorp/terraform-provider-azurerm/issues/20612)
}

# Function App with PowerShell 7 runtime and instrumentation to Application Insights
resource "azurerm_windows_function_app" "danglingdns" {
  name                = "danglingdns-functionapp"
  location            = azurerm_resource_group.danglingdns.location
  resource_group_name = azurerm_resource_group.danglingdns.name

  storage_account_name          = azurerm_storage_account.danglingdns.name
  storage_account_access_key    = azurerm_storage_account.danglingdns.primary_access_key
  service_plan_id               = azurerm_service_plan.danglingdns.id
  https_only                    = true
  public_network_access_enabled = false

  app_settings = {
    FUNCTIONS_WORKER_RUNTIME         = "powershell"
    FUNCTIONS_WORKER_RUNTIME_VERSION = "~7"
  }

  identity {
    type = "SystemAssigned"
  }

  site_config {
    application_insights_key               = azurerm_application_insights.danglingdns.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.danglingdns.connection_string
  }

  lifecycle {
    ignore_changes = [
      tags["hidden-link: /app-insights-instrumentation-key"],
      tags["hidden-link: /app-insights-resource-id"],
      tags["hidden-link: /app-insights-conn-string"],
      site_config["cors"] # temporary solution for the provider bug introduced in v3.37. PR345
    ]
  }
}

# Deploy Function configuration
resource "azurerm_function_app_function" "getdanglingdnsrecords" {
  name            = "GetDanglingDnsRecords"
  function_app_id = azurerm_windows_function_app.danglingdns.id
  language        = "PowerShell"

  file {
    name    = "run.ps1"
    content = file("${path.module}/../../scripts/run.ps1")
  }

  file {
    name    = "../requirements.psd1"
    content = file("${path.module}/../../scripts/requirements.psd1")
  }

  config_json = jsonencode({
    "bindings" : [
      {
        "name" : "Timer",
        "type" : "timerTrigger",
        "direction" : "in",
        "schedule" : "0 0 */12 * * *"
      }
    ]
  })
}

# Temp Action Group to notify Dangling DNS Records when found / It will be changed to the CCOE existing action group
resource "azurerm_monitor_action_group" "danglingdns" {
  name                = "danglingdns-functionapp-actiongroup"
  resource_group_name = azurerm_resource_group.danglingdns.name
  short_name          = "dangling"

  email_receiver {
    name                    = "CCOE-Secops"
    email_address           = "azure.secops.nos@nos.pt"
    use_common_alert_schema = true
  }

  email_receiver {
    name                    = "CCOE-Operations"
    email_address           = "azure.operations.nos@nos.pt"
    use_common_alert_schema = true
  }

  email_receiver {
    name                    = "CCOE-Netops"
    email_address           = "azure.netops.nos@nos.pt"
    use_common_alert_schema = true
  }

}

# Query Alert Rule to notify Dangling DNS Records when found
resource "azurerm_monitor_scheduled_query_rules_alert" "danglingdns" {
  name                = "danglingdns-azure-query-alert"
  location            = azurerm_resource_group.danglingdns.location
  resource_group_name = azurerm_resource_group.danglingdns.name

  action {
    action_group           = [azurerm_monitor_action_group.danglingdns.id]
    email_subject          = "[CRITICAL] Dangling DNS Records Found!"
    custom_webhook_payload = "{}"
  }
  data_source_id = azurerm_application_insights.danglingdns.id
  description    = "[CRITICAL] Dangling DNS Records Found! It alerts when any dangling DNS record is found in any public DNS zone. Please check the query in Application Insights to identify and fix the dangling DNS record(s)."
  enabled        = true
  # Count all requests with CName records missing result code grouped into 5-minute bins
  query                   = <<-QUERY
  traces
    | where message contains "DANGLING DNS NAMES FOUND ->"
    | summarize by message
  QUERY
  severity                = 1
  frequency               = 720
  time_window             = 780
  auto_mitigation_enabled = true
  trigger {
    operator  = "GreaterThanOrEqual"
    threshold = 1
  }
}

data "azurerm_management_group" "nos" {
  name = "NOS"
}

# Role Assignment to give Reader access to the Function App System Managed Identity at NOS management group level
resource "azurerm_role_assignment" "nos" {
  scope                = data.azurerm_management_group.nos.id
  role_definition_name = "Reader"
  principal_id         = azurerm_windows_function_app.danglingdns.identity[0].principal_id
}

resource "azurerm_resource_group_template_deployment" "danglingdns" {
  name                = "danglingdns-logicapp-deploy"
  resource_group_name = azurerm_resource_group.danglingdns.name
  deployment_mode     = "Incremental"
  parameters_content = jsonencode({
    "workflows_logic-app-workflow-danglingdns_name" = {
      value = "logic-app-workflow-danglingdns"
    }
  })
  template_content = file("${path.module}/../../templates/armtemplate-logicapp-danglingdns.json")
}

