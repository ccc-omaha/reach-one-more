#!/usr/bin/env bash
# Run once BEFORE cancelling Squarespace: downloads every Squarespace CDN image
# into /images and rewrites index.html to use the local copies.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p images
grep -oE 'https://images\.squarespace-cdn\.com/[^"'"'"' )]+' index.html | sort -u | while read -r url; do
  base="${url%%\?*}"; name="$(basename "$base" | sed 's/+/-/g')"
  [ -f "images/$name" ] || curl -fsSL "$base?format=2500w" -o "images/$name"
  esc=$(printf '%s' "$url" | sed 's/[.[\*^$/&?]/\\&/g')
  sed -i.bak "s/$esc/images\/$name/g" index.html
done
rm -f index.html.bak
echo "Done. Commit the images folder and index.html."
