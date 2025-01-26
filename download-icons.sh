#!/bin/bash

# Enable error handling
set -e

# Time to yoink some RuneLite icons!
echo "🧙‍♂️ Starting the great icon heist..."

# Set up our paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
TEMP_DIR=$(mktemp -d)
ICON_DIR="$SCRIPT_DIR/src/public/assets/icons/runelite_icons"

echo "📁 Created temp directory at $TEMP_DIR"

# Clone the specific directory we need
echo "🔮 Cloning RuneLite repo..."
git clone --depth 1 --filter=blob:none --sparse https://github.com/runelite/runelite.git "$TEMP_DIR" || {
    echo "❌ Failed to clone repo"
    exit 1
}

cd "$TEMP_DIR" || {
    echo "❌ Failed to change to temp directory"
    exit 1
}

# Set up sparse checkout to only get what we fucking need
echo "🎯 Setting up sparse checkout..."
git sparse-checkout set runelite-client/src/main/resources || {
    echo "❌ Failed to set sparse checkout"
    exit 1
}

# Create our icon directory if it doesn't exist
echo "📁 Creating icon directory..."
mkdir -p "$ICON_DIR" || {
    echo "❌ Failed to create icon directory"
    exit 1
}

# Copy all the PNG files to our icon directory
echo "🎯 Yoinking the icons..."
find runelite-client/src/main/resources -name "*.png" -exec cp -v {} "$ICON_DIR/" \; || {
    echo "❌ Failed to copy icons"
    exit 1
}

# Clean up after ourselves like proper wizards
cd "$SCRIPT_DIR"
rm -rf "$TEMP_DIR"

# Count how many icons we got
ICON_COUNT=$(ls "$ICON_DIR"/*.png 2>/dev/null | wc -l)
echo "🎉 Bloody brilliant! Downloaded $ICON_COUNT icons to $ICON_DIR"

# List the icons we got
echo "📋 Here are the icons we yoinked:"
ls -l "$ICON_DIR" 