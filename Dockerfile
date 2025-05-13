# syntax=docker/dockerfile:1
# check=error=true

####################################################################################################
#
# Multi-stage build for zephyr docker containers
#
# system
#   Up-to-date Linux system with a new Python interpreter installed
#
# uv
#   uv tooling installed
#
# build
#   zephyr-related artifacts are built (caches, venv)
#
# zephyr-build
#   Final, uv tooling installed, current uv cache available. Used to _build_ zephyr and run
#   code checkers.
#
# zephyr-run
#   Final, with venv where zephyr is installed and ready to run commands in CI.
####################################################################################################

# globally shared vars:
ARG C4_PYTHON=python3.13
ARG C4_HOME=/opt/zephyr
ARG PIP_INDEX_URL=https://common.artifactory.cc.bmwgroup.net/artifactory/api/pypi/codecraft-pypi-public/simple

# renovate: datasource=github-releases packageName=elastic/beats versioning=loose
ARG FILEBEAT_VERSION=8.18.0

# renovate: datasource=github-releases packageName=astral-sh/uv versioning=semver
ARG UV_VERSION=0.7.2

# create image from CC base image for k8s-based container builds:
FROM common.artifactory.cc.bmwgroup.net/codecraft-docker/cnbi/ubuntu-lts:24.04 AS system

ARG C4_PYTHON

# Base image current user is "zuul", so switch to root temporarily for system updates and
# installations.
# Allow this stage to finish as root as all final stages finish as zuul.
# hadolint ignore=DL3002
USER root

ARG DEBIAN_FRONTEND=noninteractive

# Install latest security updates and tools.
# Remove apt cache later, as we might install in subsequent stages.
# hadolint ignore=DL3009
RUN apt-get update && \
    apt-get -y upgrade && \
    apt-get install -y --no-install-recommends vim && \
    apt-get install -y --no-install-recommends software-properties-common && \
    apt-get install -y --no-install-recommends gpg-agent && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get install -y --no-install-recommends $C4_PYTHON && \
    apt-get install -y --no-install-recommends $C4_PYTHON-venv

# configure Python:
ENV PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random

FROM system AS uv

ARG C4_PYTHON
ARG UV_VERSION

# configure uv and pyright (do not warn about new available version):
ENV UV_CACHE_DIR=/var/cache/pyuv \
    UV_HOME=/opt/uv \
    PYRIGHT_PYTHON_IGNORE_WARNINGS=1

# install uv and make it accessible for all users:
WORKDIR /home/zuul

SHELL ["/bin/bash", "-o", "pipefail", "-c"]
RUN $C4_PYTHON -m venv $UV_HOME && \
    $UV_HOME/bin/python -m pip install -U setuptools pip wheel && \
    $UV_HOME/bin/python -m pip install uv==$UV_VERSION && \
    chmod -R a+rX $UV_HOME

# make it available:
ENV PATH="$UV_HOME/bin:$PATH"

# install npm, required to run pyright, following instructions from
# https://github.com/nodesource/distributions to get a recent enough version:
COPY scripts/nodesource-nodejs-setup_23.x nodejs-setup
RUN bash nodejs-setup && \
    apt-get install -y --no-install-recommends nodejs && \
    npm update -g npm && \
    rm -rf nodejs-setup

FROM uv AS build

ARG C4_PYTHON
ARG C4_HOME
ARG PIP_INDEX_URL

# run uv to fill cache:
WORKDIR /home/zuul
COPY . zephyr

# create uv build environment and cache:
WORKDIR /home/zuul/zephyr
RUN uv sync

# create zephyr run environment:
RUN uv build &&  \
    uv export --no-emit-project > dist/requirements.txt && \
    $C4_PYTHON -m venv $C4_HOME && \
    $C4_HOME/bin/pip install -U setuptools pip wheel && \
    $C4_HOME/bin/pip install -r dist/requirements.txt && \
    $C4_HOME/bin/pip install dist/*.whl && \
    ln -s $C4_HOME/bin/c4 $C4_HOME/c4

# ensure some additional packages are installed for external scripts (no versions, no update, to let
# zephyr choose:
RUN $C4_HOME/bin/pip install daiquiri github3.py

# Install pyright npm package by calling the Python wrapper installed through uv, fills the
# pyright npm cache. Multiple RUN layers not an issue in this stage that is not ending up in final
# image (only some folders are copied).
# hadolint ignore=DL3059
RUN uv run pyright --version

FROM uv AS zephyr-build

# remove apt cache:
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=build $UV_CACHE_DIR $UV_CACHE_DIR

# let all users read/write the caches:
RUN chmod -R a+rwX "$UV_CACHE_DIR"

# switch back to zuul user for use by CI:
USER zuul

FROM system AS zephyr-run

ARG C4_HOME
ARG FILEBEAT_VERSION

# install runtime-only tools and remove apt cache:
RUN curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-${FILEBEAT_VERSION}-amd64.deb && \
    dpkg -i filebeat-${FILEBEAT_VERSION}-amd64.deb && \
    rm -f filebeat-${FILEBEAT_VERSION}-amd64.deb && \
    rm -rf /var/lib/apt/lists/*

COPY --from=build $C4_HOME $C4_HOME

# let all users execute c4:
RUN chmod -R a+rX $C4_HOME

# provide c4 as symlink to prevent polluting the system Python version via PATH, also provide venv
# for potential use by other sripts:
ENV PATH="$C4_HOME:$PATH" \
    C4_VENV=$C4_HOME

# switch back to zuul user for use by CI:
USER zuul
