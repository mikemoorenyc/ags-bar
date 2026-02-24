import Button from "./Button";
import { Accessor, createBinding ,createComputed} from "gnim";
//@ts-ignore;
import Bluetooth from "gi://AstalBluetooth"
import { execAsync } from "ags/process";

export default function BluetoothButton ({closeWindow}:{closeWindow:()=>void}) {
    const bluetooth = Bluetooth.get_default();
    
        const isVisible = createBinding(bluetooth, "isConnected");
        const activeComputed = createComputed(()=>isVisible()?"bluetooth active":"bluetooth")
        const iconName = createComputed(()=>isVisible()?"bluetooth-connected":"bluetooth")

        const devices :Accessor<Bluetooth.Device[]> = createBinding(bluetooth,"devices");

        const label = createComputed(()=> {
            if(!isVisible()) return "Bluetooth";


            if(!devices().length) return "Bluetooth";
            const deviceamt =devices().filter(d=>d.connected == true).length 
            if( deviceamt > 1)return `${deviceamt} devices`
            if(deviceamt === 0)return "Bluetooth";
            let title = "Bluetooth"
            devices().forEach((d)=> {
           
                if(d.connected ===true) {
                    
                    title = d.name;
                    return false; 
                }
            })
            
            return title; 
        })

    return <Button extraClasses={activeComputed}
    buttonClick={()=> {
        closeWindow(); 
        execAsync("omarchy-launch-bluetooth")
        
    }}
    iconName={iconName}
    label={label}
    
    />
}