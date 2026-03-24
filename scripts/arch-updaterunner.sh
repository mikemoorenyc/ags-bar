#!/usr/bin/env bash

omarchy-launch-or-focus-tui 'sudo pacman -Syu'
exec '/home/admin/.config/ags/scripts/arch-check-updates.sh'