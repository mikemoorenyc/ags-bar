#!/bin/bash

ACTIVE=$(pactl list source-outputs | grep -c "Source Output #")

if [[ $ACTIVE -lt 1 ]]; then 

exit 0; 
fi

ICON="󰍬"
ICON_MUTED="󰍭"
RECORDING="Mic is on"
MUTECLASS=""
mic_muted=$(
  pactl list sources |
  grep -A10 "Source #" |
  grep -q "Mute: yes" && echo true || echo false
)
DEFAULT_MIC="$(pactl get-default-source)"
DEFAULT_SPEAKER="$(pactl get-default-sink)"
REPLACER=""
DEFAULT_MIC="${DEFAULT_MIC/"alsa_input."/$REPLACER}"
DEFAULT_SPEAKER="${DEFAULT_SPEAKER/"alsa_output."/$REPLACER}"
if [[ $DEFAULT_MIC == $DEFAULT_SPEAKER ]]; then

ICON="󰍬"
ICON_MUTED="󰍭"
fi

if [[ $mic_muted == true ]]; then 
    ICON=$ICON_MUTED
    RECORDING="Mic is muted"
    MUTECLASS="muted"
fi 
echo "{\"text\":\"$ICON\",\"alt\":\"$RECORDING\",\"class\":\"$MUTECLASS\"}"
