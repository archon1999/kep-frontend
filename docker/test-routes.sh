#!/bin/sh
set -eu

# Run inside the built frontend image to catch route/static-directory collisions.
response=$(mktemp)
trap 'rm -f "$response"' EXIT

for attempt in 1 2 3 4 5; do
    if wget -q -O "$response" http://127.0.0.1/healthz; then
        break
    fi
    sleep 1
done

for route in / /games /games/ /games/keppy-world /games/code-islands /games/bug-hunt /games/logic-circuit /games/memory-grid; do
    wget -q -O "$response" "http://127.0.0.1$route"
    cmp "$response" /usr/share/nginx/html/index.html
    printf 'SPA route OK: %s\n' "$route"
done

wget -q -O "$response" http://127.0.0.1/games/bug-hunt-preview.svg
cmp "$response" /usr/share/nginx/html/games/bug-hunt-preview.svg
printf 'Static game asset OK\n'
