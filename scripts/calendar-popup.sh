#!/usr/bin/env bash

# persistent month offset
STATE="${XDG_RUNTIME_DIR}/calendar_offset"
offset=$(cat "$STATE" 2>/dev/null || echo 0)

case "$1" in
  next) offset=$((offset + 1)) ;;
  prev) offset=$((offset - 1)) ;;
  reset) offset=0 ;;
esac

echo "$offset" > "$STATE"

# launch YAD calendar for that month
yad --calendar \
    --title="Calendar" \
    --undecorated \
    --button="Prev":0 \
    --button="Next":1 \
    --button="Close":2 \
    --month="$(date --date="$offset month" +%m)" \
    --year="$(date --date="$offset month" +%Y)" \
    --center \
    --borders=10 \
    --width=220 \
    --height=200
