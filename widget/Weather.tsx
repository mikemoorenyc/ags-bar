import { monitorFile, readFileAsync } from "ags/file"
import { createComputed, createEffect, createState, onCleanup } from "gnim"
import fetch from "gnim/fetch"
import weathersymbol from "../util/weathersymbol"
import { execAsync } from "ags/process"

export type TWeatherData = {
    current: {
        temperature_2m:number,
        apparent_temperature:number,
        weather_code:number,
        is_day:0|1
    }
    hourly: {
        time: string[],
        temperature_2m: number[],
        weather_code:number[],
        precipitation_probability:number[],
        is_day:0|1
    }
    daily: {
        time:string[],
        weather_code:number[], 
        temperature_2m_max:number[],
        temperature_2m_min:number[],
        precipitation_probability_max:number[]
    }

}

export default function Weather() {
    const infoPath = "/home/admin/.cache/current-weather"
    
    const [isVisible,updateIsVisible] = createState(false)
    
    const [weather,updateWeather] = createState<null|TWeatherData>(null)
    
   
    const mainTemp = createComputed(()=> {
        if(!weather()) return ""
        return Math.floor(weather()?.current.temperature_2m||0)+"°"
    })
    const mainIcon = createComputed(()=> {
        if(!weather()) return "";
        return weathersymbol(weather()?.current.weather_code!,weather()?.current.is_day!)
    })
  

    let monitor = monitorFile(infoPath,()=> {
        getData(); 
    })

    const getData = async ()=> {
        try {
            const data = await readFileAsync(infoPath);

            updateWeather(JSON.parse(data) as TWeatherData);
            updateIsVisible(true);
        } catch(error) {
            console.log(error);
            updateIsVisible(false);
        }
        
        /*
        if(!url()) {
            console.log("no url");
            return ; 
        }
        try {
            const data = await fetch(url())
            const update = await data.json() as TWeatherData; 
            updateWeather(update);
            updateIsVisible(true);
        } catch (error) {
            console.log(error)
        }
            */
    }
    return <box
    visible={isVisible}
    $={self=> {
        execAsync("/home/admin/.config/ags/scripts/weather-fetch.sh")
        getData();
    }}
    >
        <menubutton class={"container-spacer button temp-popover"}>
            <box spacing={3}>
                <image pixelSize={18} iconName={mainIcon} visible={createComputed(()=>mainIcon().length > 1)}/>
                <label class={"temp-label"}label={mainTemp} />
               
            </box>
        </menubutton>
    </box>
}