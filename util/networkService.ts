// networkStore.ts
import {  createComputed } from "ags"
import { createPoll } from "ags/time"
import { execAsync } from "ags/process"

export type NetworkData = {
    strength: number,
    connected: boolean,
    vpn: boolean,
    ssid:string
}

const rawJSON = createPoll(
    `{"strength":1,"connected":false,"vpn":false}`,
    5000,
    async () => {
   
        try {
            return (await execAsync(
                "/home/admin/.config/waybar/scripts/network-test.sh"
            )).trim()
        } catch {
            return `{"strength":1,"connected":false,"vpn":false}`
        }
    }
)

// Parse once
const parsed = createComputed<NetworkData>(() =>
    JSON.parse(rawJSON())
)
const icon = (strength:number,connected:boolean,vpn:boolean)=> {
    
    
    if(!connected) {
        return "wifioff"
    }
    if(vpn) {
        return "wifiprotected";
    }
    const str = strength.toString()
    return `wifi${str}`
}

 

// Export fine-grained accessors
export default  {
    data: parsed,
    strength: createComputed(() => parsed().strength),
    connected: createComputed(() => parsed().connected),
    vpn: createComputed(() => parsed().vpn),
    ssid: createComputed(()=> parsed().ssid),
    icon: createComputed(()=> icon(parsed().strength,parsed().connected,parsed().vpn))
}