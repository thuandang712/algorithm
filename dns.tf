resource "azurerm_resource_group" "test" {
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
