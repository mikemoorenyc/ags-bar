#!/bin/bash

CLOCK="$(~/.config/waybar/scripts/pomo/pomo.sh clock)"
#RETURNS --:--
CLEANCLOCK="$(echo "$CLOCK" | sed 's/^ *//')"
FIRSTCHAR="${CLEANCLOCK:0:1}";
TIMECLASS="";
if [[ $FIRSTCHAR == *"-"* ]]; then
exit 0;
fi
ALT="play"
TIME="${CLEANCLOCK:1}";
TIMECLASS="time-$FIRSTCHAR"

if [[ $FIRSTCHAR == *"P"* ]]; then
TIME="${CLEANCLOCK:2}"
TIMECLASS="time-P${CLEANCLOCK:1:1}"
ALT="pause"
fi
echo "{\"text\":\"$TIME\",\"class\":\"$TIMECLASS\",\"alt\":\"$ALT\"}"