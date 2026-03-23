import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"


export default function Launcher() {
    return <box 
    

    class={"launcher-container"}>
        <button 
        tooltipText={"Apps"}
        
        onClicked={
            ()=> {
                execAsync("ags request launcherstate apps -i my-shell")
            }
        }
        class={"container-spacer button launcher-button "}>
           <image iconName={"banana-launcher-symbolic"} pixelSize={20} />
        </button>

    </box>
}