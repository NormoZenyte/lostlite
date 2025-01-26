#!/bin/bash

# Enable error handling
set -e

echo "🧙‍♂️ Time to organize these fucking icons!"

# Set up our paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SOURCE_DIR="$SCRIPT_DIR/src/public/assets/icons/runelite_icons"
TARGET_BASE="$SCRIPT_DIR/src/public/assets/icons"

# Create directories for different icon categories
mkdir -p "$TARGET_BASE"/{skills,plugins,runes,teleports,ui,emojis}

# Move skill icons
echo "🎯 Moving skill icons..."
mv "$SOURCE_DIR"/*skill*.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/agility.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/attack.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/defence.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/fishing.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/hitpoints.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/magic.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/mining.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/prayer.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/ranged.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/runecraft.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/slayer.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/strength.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/thieving.png "$TARGET_BASE/skills/" 2>/dev/null || true
mv "$SOURCE_DIR"/woodcutting.png "$TARGET_BASE/skills/" 2>/dev/null || true

# Move rune icons
echo "🎯 Moving rune icons..."
mv "$SOURCE_DIR"/*_rune.png "$TARGET_BASE/runes/" 2>/dev/null || true

# Move plugin icons
echo "🎯 Moving plugin icons..."
mv "$SOURCE_DIR"/*plugin*.png "$TARGET_BASE/plugins/" 2>/dev/null || true

# Move teleport icons
echo "🎯 Moving teleport icons..."
mv "$SOURCE_DIR"/*teleport*.png "$TARGET_BASE/teleports/" 2>/dev/null || true

# Move UI elements
echo "🎯 Moving UI elements..."
mv "$SOURCE_DIR"/arrow_*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/back_*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/front_*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/config_*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/cursor_*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/icon.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/panel_*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/reset*.png "$TARGET_BASE/ui/" 2>/dev/null || true
mv "$SOURCE_DIR"/search.png "$TARGET_BASE/ui/" 2>/dev/null || true

# Move emoji icons
echo "🎯 Moving emoji icons..."
mv "$SOURCE_DIR"/alien.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/blush.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/cry.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/eyes.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/flushed.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/grinning.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/heart*.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/joy.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/rage.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/smile*.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/sob.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/sunglasses.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/wink.png "$TARGET_BASE/emojis/" 2>/dev/null || true
mv "$SOURCE_DIR"/xd.png "$TARGET_BASE/emojis/" 2>/dev/null || true

# Move remaining icons to plugins directory
mv "$SOURCE_DIR"/*.png "$TARGET_BASE/plugins/" 2>/dev/null || true

echo "🎉 Bloody brilliant! Icons organized into categories!" 