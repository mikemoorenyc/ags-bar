#!/bin/bash

CLOCK="$(~/.config/waybar/scripts/pomo/pomo.sh clock)"
#RETURNS --:--
CLEANCLOCK="$(echo "$CLOCK" | sed 's/^ *//')"
FIRSTCHAR="${CLEANCLOCK:0:1}"
LASTCHAR="${CLEANCLOCK: -1}"

if [[ $FIRSTCHAR == *"-"* ]]; then

 echo "{\"text\":\"\",\"class\":\"idle\",\"alt\":\"Start pomodoro\"}"
exit 0;
fi



if [[ $FIRSTCHAR == "P" ]]; then
    # Paused, remove first 2 characters
    TIME_WITHOUT_PREFIX="${CLEANCLOCK:2}"
else
    # Normal, remove 1 character
    TIME_WITHOUT_PREFIX="${CLEANCLOCK:1}"
fi
MINUTES="${TIME_WITHOUT_PREFIX%%:*}"

MINUTES=$((10#$MINUTES))

if [[ $FIRSTCHAR == *"B"* ]]; then 
echo "{\"text\":\"\",\"class\":\"break\",\"alt\":\"Take a break\"}"
exit 0;
fi


if (( MINUTES > 20 )); then
    echo "{\"text\":\"\",\"class\":\"start\",\"alt\":\"Keep working\"}"
    exit 0;
fi
if (( MINUTES >  10)); then
    echo "{\"text\":\"\",\"class\":\"middle\",\"alt\":\"Keep working\"}"
    exit 0;
fi
if (( MINUTES >  0)); then
    echo "{\"text\":\"\",\"class\":\"end\",\"alt\":\"Keep working\"}"
    exit 0;
fi




#WORKING
if [[ $FIRSTCHAR == *"W"* ]]; then 
echo "{\"text\":\"\",\"class\":\"middle\",\"alt\":\"Keep working\"}"
exit 0;
fi
#BREAK
if [[ $FIRSTCHAR == *"B"* ]]; then 
echo "{\"text\":\"\",\"class\":\"break\",\"alt\":\"Take a break\"}"
exit 0;
fi
###ONLY OPTION IS PAUSED NOW
SECONDCHAR="${CLEANCLOCK:1:1}";

if [[ $SECONDCHAR == *"W"* ]]; then 
echo "{\"text\":\"\",\"class\":\"middle\",\"alt\":\"Keep working\"}"
exit 0; 
fi;
if [[ $SECONDCHAR == *"B"* ]]; then
echo "{\"text\":\"\",\"class\":\"break\",\"alt\":\"Take a break\"}"
fi
exit 0;
