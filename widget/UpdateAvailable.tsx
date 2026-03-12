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
        <button class={"container-spacer button active"} onClicked={()=>{
            execAsync([
  "foot",
  "-e",
  "bash",
  "-c",
  "sudo pacman -Syu; ~/.config/scripts/check-arch-updates.sh"
])
            
            }}>
            <image iconName={"banana-sync-symbolic"} pixelSize={18}/>
        </button>
    </box>
}