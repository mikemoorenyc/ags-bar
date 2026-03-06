import { interval, Timer } from "ags/time";
import { createComputed, createState } from "gnim"
import { execAsync } from "ags/process";

export default function UpdateAvailable() {
    const [isVisible,updateIsVisible] = createState(false); 
    let checker:Timer
    
    const updateCheck = async () => {
        try {
        const avail = await execAsync("omarchy-update-available");
        console.log(avail);
          
               if(avail.includes("Omarchy update available")) {
                updateIsVisible(true)
                return ;
               }
               updateIsVisible(false)

            } catch {
                updateIsVisible(false)
            }
    }
   
    

    const intervalLength = 1000*60*35
    return <box visible={isVisible}
    $={self => {
        checker = interval(intervalLength,()=> {
            updateCheck(); 
        })
    }

    }
    
    >
        <button class={"container-spacer button active"} onClicked={()=>{
            execAsync("omarchy-launch-floating-terminal-with-presentation omarchy-update")}}>
            <image iconName={"banana-sync-symbolic"} pixelSize={18}/>
        </button>
    </box>
}