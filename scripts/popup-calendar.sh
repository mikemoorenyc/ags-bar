#!/usr/bin/env bash

STATE="${XDG_RUNTIME_DIR}/waybar_calendar_offset"
offset=$(cat "$STATE" 2>/dev/null || echo 0)

case "$1" in
  next)
    offset=$((offset + 1))
    ;;
  prev)
    offset=$((offset - 1))
    ;;
  reset)
    offset=0
    ;;
esac

echo "$offset" > "$STATE"

# split month & year so `cal` gets them separately
month=$(date --date="$offset month" +'%m')
year=$(date  --date="$offset month" +'%Y')

cal --color=always "$month" "$year"