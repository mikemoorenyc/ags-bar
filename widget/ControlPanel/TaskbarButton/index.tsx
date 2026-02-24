import { Astal } from "ags/gtk4"
import AudioIcon from "./AudioIcon"
import BluetoothIcon from "./BluetoothIcon"
import WifiIcon from "./WifiIcons"
import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"


export default function ControlPanelButton () {
    const window: Gtk.Window|undefined = app.get_window("QUICKSETTINGS_WINDOW") as Astal.Window

    return <button 
    onClicked={()=> {
        if(window) {
            const visible = window.visible;
            window.set_visible(!visible);
        }
    }}
    
    class={"container-button control-panel taskbar-button"}>
      
        <box spacing={3}><BluetoothIcon/>
        <WifiIcon />
        <AudioIcon /></box>

        
        
    </button>
}