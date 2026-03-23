import { interval, Timer } from "ags/time";
import { createComputed, createState } from "gnim"
import { execAsync } from "ags/process";
import { monitorFile, readFileAsync } from "ags/file";

const checkPath = "/home/admin/.cache/arch-updates"

export default function UpdateAvailable() {
    const [isVisible,updateIsVisible] = createState(false); 
   
    let monitor;
    
    
    const readFile = async () => {
        try {
            const state = await readFileAsync(checkPath);
               
            if(parseInt(state)===0) {
                
                updateIsVisible(false)
            } else {
                updateIsVisible(true)
            }
        } catch {
            console.log("couldn't check")
        }
        
    }

    
    return <box visible={isVisible}
    $={self => {
        
        readFile(); 
        monitor = monitorFile(checkPath,()=> {
            readFile(); 
        })

    }

    }
    
    >
        <button hasTooltip tooltipText={"Arch updates available"}  class={"container-spacer button big-raised update-available"} onClicked={async ()=>{
           await execAsync(`/home/admin/.config/ags/scripts/arch-updaterunner.sh`)
           await execAsync('/home/admin/.config/ags/scripts/arch-check-updates.sh')
    
            }}>
            <image iconName={"banana-sync-symbolic"} pixelSize={20} />
        </button>
    </box>
}