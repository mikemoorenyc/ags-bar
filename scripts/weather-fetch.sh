 #!/bin/bash

input_file="/home/admin/.config/ags/weatherdata"


CACHE="/home/admin/.cache/current-weather"


api_key=$(sed -n '1p' "$input_file")


coords=$(sed -n '2p' "$input_file")


IFS=',' read -r lat lng <<< "$coords"


api_url="https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=temperature_2m,weather_code,precipitation_probability,precipitation,is_day&current=temperature_2m,apparent_temperature,is_day,weather_code&timezone=America%2FNew_York&temperature_unit=fahrenheit&forecast_days=3"


output_file="$CACHE"


curl -s "$api_url" -o "$output_file"

echo "API response saved to $output_file"