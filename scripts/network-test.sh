#!/usr/bin/env bash

INTERFACE="wlan0"

link_info=$(iw dev "$INTERFACE" link 2>/dev/null)

if echo "$link_info" | grep -q "Connected"; then
    connected=true

  
    ssid=$(echo "$link_info" | awk -F'SSID: ' '/SSID:/ {print $2}')


    signal_dbm=$(echo "$link_info" | awk '/signal/ {print $2}')


    if [ "$signal_dbm" -ge -60 ]; then
        strength=4
    elif [ "$signal_dbm" -ge -70 ]; then
        strength=3
    elif [ "$signal_dbm" -ge -80 ]; then
        strength=2
    else
        strength=1
    fi
else
    connected=false
    strength=0
    ssid=null
fi


if nordvpn status 2>/dev/null | grep -q "Status: Connected"; then
    vpn=true
else
    vpn=false
fi


printf '{"vpn":%s,"strength":%s,"connected":%s,"ssid":%s}\n' \
    "$vpn" \
    "$strength" \
    "$connected" \
    "$( [ "$ssid" = null ] && echo null || printf '"%s"' "$ssid" )"