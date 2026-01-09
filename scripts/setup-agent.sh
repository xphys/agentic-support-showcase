#!/bin/bash

# Navigate to the backend directory
cd "$(dirname "$0")/../backend" || exit 1

# Install dependencies using uv
uv sync
