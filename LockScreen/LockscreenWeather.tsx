import { readFileAsync } from "ags/file";
import { TWeatherData } from "../widget/Weather";
import { createState, For } from "gnim";
import weathersymbol from "../util/weathersymbol";
import { Gtk } from "ags/gtk4";


const ampmformat = (h:number) => `${h % 12 || 12}${h >= 12 ? "PM" : "AM"}`;

export type THourData = {
    weather_code:number, 
    temperature:number,
    is_day:0|1,
    time:string
}

export default function LockscreenWeather() {
    const [hourData,updateHourData] = createState<THourData[]>([])

    const getInfo = async () => {
              const d = new Date();

const pad = (n:number) => String(n).padStart(2, "0");

const formatted =
  d.getFullYear() +
  "-" + pad(d.getMonth() + 1) +
  "-" + pad(d.getDate()) +
  "T" + pad(d.getHours()) +
  ":" + "00"


  console.log(formatted);
const hourraw = await readFileAsync('/home/admin/.cache/current-weather');

const parsed = JSON.parse(hourraw) as TWeatherData;

const hourIndex = parsed.hourly.time.findIndex(t =>t===formatted);
if(hourIndex<0) return ; 
const {hourly} = parsed
const hourArray : THourData[]= []
for (let i = 0; i < 8; i++) {
  hourArray.push({
    weather_code:hourly.weather_code[hourIndex+i],
    temperature: Math.floor(hourly.temperature_2m[hourIndex+i]),
    is_day: hourly.is_day[hourIndex+i],
    time: new Date(hourly.time[hourIndex+i])
  .toLocaleString("en-US", { hour: "numeric", hour12: true }).split(" ").join("")
  })
}
updateHourData(hourArray);
    }

    

    return <box
    class={"lockscreen-weather"}
    $={self => {
        getInfo(); 
    }
    }>
      <For each={hourData}>
        {hour=><box class={"hour-weather-item"} hexpand orientation={Gtk.Orientation.VERTICAL}>
            <image iconName={weathersymbol(hour.weather_code,hour.is_day)} pixelSize={84 } />
            <label class="temp-label" label={`${hour.temperature}°`}></label>
            <label class="time-label" label={hour.time} />
            </box>}
      </For>
    </box>
}