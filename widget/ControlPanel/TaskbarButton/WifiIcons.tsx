
//@ts-ignore
import AstalNetwork from "gi://AstalNetwork"
import { createBinding,createComputed, createEffect, createState, onCleanup } from "ags"
import { execAsync } from "ags/process"
import { createPoll } from "ags/time"

type returnData = {
    strength:number,
    connected:boolean,
    vpn:boolean
}
export default function WifiIcon() {
   const networkJSON = createPoll(
        `{"strength":1,"connected":false,"vpn":false}`,
        2000,
        async () => {
            try {
                return await execAsync(
                    "/home/admin/.config/waybar/scripts/network-test.sh"
                )
            } catch {
                return `{"strength":1,"connected":false,"vpn":false}`
            }
        }
    )


    const data = createComputed(()=> {
    
        const net : returnData= JSON.parse(networkJSON());
        if(!net.connected) {
            return "wifioff-symbolic"
        }
        if(net.vpn) {
            return "wifiprotected-symbolic";
        }
        const str = net.strength.toString()
        return `wifi${str}-symbolic`
    })
    const boxClass = createComputed(()=> {
        let cl = "taskbar-icon wifi-icon"
        if(data() == "wifiprotected-symbolic") {
            return cl+" protected";
        }
        return cl; 
    })

 
    return <box class={boxClass}>
        <image iconName={data} pixelSize={16} />
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