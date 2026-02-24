import { Accessor, createComputed, createEffect, createState } from "gnim";
import Button from "./Button";
import { execAsync } from "ags/process";



export default function() {
    const [active,updateActive] = createState(false);
    const normalTemp = 6000
    const nightTemp = 4000

    const label: Accessor<string> = createComputed(()=>active()?"Nightlight on":"Nightlight off")
    const checkTemp = async() => {
        try {
            const check = execAsync("hyprctl hyprsunset temperature")
            const temp = parseInt(await check);
           
            if(temp > 4000) {
                
                updateActive(false)
            } else {
          
                updateActive(true);
            }
        
        } catch (err) {
            console.error(err)
        }
    }
    
    const command = createComputed(()=>`hyprctl hyprsunset temperature ${active()?normalTemp:nightTemp}`)

    const clickedButton = async () => {
        execAsync(command())
        if(active()) {
            updateActive(false);
        } else {
            updateActive(true)
        }
        

    }
    const activeComputed = createComputed(()=>active()?"active":"")

    return <Button 
    $={self => {
        checkTemp(); 
    }}
    
     buttonClick={clickedButton} iconName="night" label={label} extraClasses={activeComputed}/>
}