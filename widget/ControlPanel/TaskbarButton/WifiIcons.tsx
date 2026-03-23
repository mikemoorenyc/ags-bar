
//@ts-ignore

import { createComputed } from "ags"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"
import  network from "../../../util/networkService"
import Gtk from "gi://Gtk?version=4.0"

type returnData = {
    strength:number,
    connected:boolean,
    vpn:boolean,
    ssid?:string
}
export default function WifiIcon() {


    const data = createComputed(()=> {
        const symbol = network.icon();
        return `banana-${symbol}-symbolic`
    })
    const tooltip = createComputed(()=> {
     
        if(!network.ssid()) return "No ssid";
        return network.ssid();
    })
    const boxClass = createComputed(()=>network.vpn()?"taskbar-icon wifi-icon protected":"taskbar-icon wifi-icon")

 
    return <box  tooltipText={tooltip} class={boxClass}>
        <image  iconName={data} pixelSize={16} halign={Gtk.Align.CENTER}/>
    </box>
}

/*


signal=$(iw dev wlan0 link | awk '/signal/ {print $2}')

if [ -z "$signal" ]; then
    echo "Disconnected"
else
    percent=$(( (signal + 100) * 2 ))
    echo "$percent%"
fi


*/

//<image iconName={"wifioff-symbolic"} pixelSize={14} /> 
//iconName={"network-wireless-signal-excellent-symbolic"} 