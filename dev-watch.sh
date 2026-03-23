#!/usr/bin/env bash

echo "Watching for changes"

start_ags() {
  echo "Starting"
  ags run app.ts &

  AGS_PID=$!
}

stop_ags() {
  if [[ -n "$AGS_PID" ]] && kill -0 "$AGS_PID" 2>/dev/null; then
    echo "Stopping"
    ags -i my-shell quit
    wait "$AGS_PID" 2>/dev/null
  fi
}

# Ensure cleanup on Ctrl+C
trap stop_ags EXIT INT TERM

# start once
start_ags

while inotifywait -r \
  -e modify,create,delete,move \
  --exclude 'node_modules|\.git|@girs' \
  .; do
  sleep 0.2
  stop_ags
  start_ags
done
