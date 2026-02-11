#!/bin/bash

CLOCK="$(~/.config/waybar/scripts/pomo/pomo.sh clock)"
#RETURNS --:--
CLEANCLOCK="$(echo "$CLOCK" | sed 's/^ *//')"
FIRSTCHAR="${CLEANCLOCK:0:1}";
TIMECLASS="";
if [[ $FIRSTCHAR == *"-"* ]]; then
exit 0;
fi
ALTTEXT="▶️"
if [[ $FIRSTCHAR == *"P"* ]]; then
ALTTEXT="⏸️"

fi
