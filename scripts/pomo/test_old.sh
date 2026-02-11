#!/bin/bash

CLOCK="$(~/.config/waybar/scripts/pomo/pomo.sh clock)"
#RETURNS --:--
CLEANCLOCK="$(echo "$CLOCK" | sed 's/^ *//')"
FIRSTCHAR="${CLEANCLOCK:0:1}"


if [[ $FIRSTCHAR == *"-"* ]]; then

 echo "{\"text\":\"m\",\"class\":\"idle\",\"alt\":\"Start timer\"}"
exit 0;
fi
#WORKING
if [[ $FIRSTCHAR == *"W"* ]]; then 
echo "{\"text\":\"🍅\",\"class\":\"working\",\"alt\":\"Work time\"}"
exit 0;
fi
#BREAK
if [[ $FIRSTCHAR == *"B"* ]]; then 
echo "{\"text\":\"☕\",\"class\":\"break\",\"alt\":\"Break time\"}"
exit 0;
fi
###ONLY OPTION IS PAUSED NOW
SECONDCHAR="${CLEANCLOCK:1:1}";

if [[ $SECONDCHAR == *"W"* ]]; then 
echo "{\"text\":\"🍅\", \"class\":\"pausedworking\",\"alt\":\"Paused\"}"
exit 0; 
fi;
if [[ $SECONDCHAR == *"B"* ]]; then
echo "{\"text\":\"🍅\",\"class\":\"pausedbreak\",\"alt\":\"Paused\"}"
fi
exit 0;
