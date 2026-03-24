#!/usr/bin/env bash

CACHE="/home/admin/.cache/arch-updates"

updates=$(checkupdates 2>/dev/null)

if [ -z "$updates" ]; then
    echo "0" > "$CACHE"
    echo "" > "$CACHE.list"
else
    count=$(echo "$updates" | wc -l)
    echo "$count" > "$CACHE"
    echo "$updates" > "$CACHE.list"
fi