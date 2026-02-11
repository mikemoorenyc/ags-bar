#!/usr/bin/env bash

# Listen to NordVPN daemon logs in real time
journalctl -fu nordvpnd.service --output=cat | while read -r line; do
    # Debug: Uncomment next line if you need to see what logs look like
    # echo "$line" >> /tmp/nordvpn-debug.log

    if echo "$line" | grep -qi "Connected"; then
        pkill -RTMIN+17 waybar
    fi

    if echo "$line" | grep -qi "Disconnected"; then
        pkill -RTMIN+17 waybar
    fi
done
