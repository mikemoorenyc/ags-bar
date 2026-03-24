#!/bin/bash

if pgrep -f "^gpu-screen-recorder" >/dev/null; then
  echo 'true'
else
  echo 'false'
fi