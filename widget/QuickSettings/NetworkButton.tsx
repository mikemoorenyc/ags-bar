import Button from "./Button";
import { Accessor, createBinding ,createComputed, createEffect} from "gnim";
//@ts-ignore;
import  network  from "../../util/networkService";
import { execAsync } from "ags/process";


export default function({closeWindow}:{closeWindow:()=>void}) {


    
    const extraClasses = createComputed(()=> {
        if(network.connected()) return "network active";
        return "network"
    })
    const ssid = createComputed(()=> {
        if(!network.ssid())return "No network"
        return network.ssid(); 
    })
    const icon = createComputed(()=>network.icon().toString())
    return <Button label={ssid} extraClasses={extraClasses} iconName={icon} buttonClick={()=> {
        closeWindow(); 
        execAsync("omarchy-launch-wifi")
    }}/>
    
}