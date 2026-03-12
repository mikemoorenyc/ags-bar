import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"


export default function Launcher() {
    return <box 
    

    class={"container-spacer launcher-container"}>
        <button 
        tooltipText={"Launch Menu"}
        
        onClicked={
            ()=> {
                execAsync("ags request launcherstate apps -i my-shell")
            }
        }
        class={"button launcher-button"}>
            <image iconName={"banana-launcher-symbolic"} pixelSize={20} />
        </button>

    </box>
}