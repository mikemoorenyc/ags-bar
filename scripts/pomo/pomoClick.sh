#!/bin/bash

CLOCK="$(~/.config/waybar/scripts/pomo/pomo.sh clock)"
#RETURNS --:--
CLEANCLOCK="$(echo "$CLOCK" | sed 's/^ *//')"
FIRSTCHAR="${CLEANCLOCK:0:1}";

if [[ $FIRSTCHAR == *"-"* ]]; then

POMO_WORK_TIME=30 ~/.config/waybar/scripts/pomo/pomo.sh start

fi