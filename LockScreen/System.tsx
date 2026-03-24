import { execAsync } from "ags/process"
import Gtk from "gi://Gtk?version=4.0"


export default function System () {
    const buttons = [
        ["Sleep","systemctl suspend","banana-sleep-symbolic","start"],
        ["Shutdown","omarchy-system-shutdown","banana-shutdown-symbolic","center"],
        ["Restart","omarchy-system-reboot","banana-reset-symbolic","end"]
    ]


    return <centerbox valign={Gtk.Align.END} halign={Gtk.Align.CENTER} class={"system-buttons"} vexpand hexpand $type="end" > 
        {buttons.map((b,i)=><box class="system-button-container" vexpand={i==1} $type={b[3]}><button  class={"system-button big-raised"} onClicked={()=>{execAsync(b[1])}}>
            <box orientation={Gtk.Orientation.VERTICAL}>
                <image iconName={b[2]}  pixelSize={48}/>
                <label label={b[0]} class="system-label"/>
            </box>

        </button></box>)}
    </centerbox>
}