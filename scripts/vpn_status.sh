#!/bin/bash
status="$(nordvpn status)"


server=$(echo "$status" | grep '^Server:' | cut -d':' -f2- | sed 's/^ *//')



if [[ $status == *"Status: Connected"* ]]; then
echo "{\"text\":\"󰌾\",\"tooltip\":\"$server\"}"
fi
