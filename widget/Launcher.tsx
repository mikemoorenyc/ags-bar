import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"


export default function Launcher() {
    return <box 
    

    class={"container launcher-container"}>
        <button 
        tooltipText={"Launch Menu"}
        onClicked={
            ()=> {
                execAsync("omarchy-menu")
            }
        }
        class={"button launcher-button"}>󰀻</button>

    </box>
}