#!/usr/bin/env bash

DIR="$HOME/.config/waybar/scripts"

while true; do
    yad $DIR/calendar-popup.sh reset
    response=$?

    case $response in
        0) $DIR/calendar-popup.sh prev ;;
        1) $DIR/calendar-popup.sh next ;;
        2) break ;;
        *) break ;;
    esac
done
