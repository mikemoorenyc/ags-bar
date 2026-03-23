import { Astal } from "ags/gtk4"
import AudioIcon from "./AudioIcon"
import BluetoothIcon from "./BluetoothIcon"
import WifiIcon from "./WifiIcons"
import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import { createComputed, createState, onCleanup } from "gnim"



export default function ControlPanelButton () {
    const window: Gtk.Window|undefined = app.get_window("QUICKSETTINGS_WINDOW") as Astal.Window
    let visible_check:number
    const [isVisible,updateVisible] = createState(false);
    const classes = createComputed(()=> {
        let c = "container-button control-panel button taskbar-button";
        if(isVisible()) {
            c+=" active"
        }
        return c; 
    })

    return <button 
    $={self=>{
        if(window) {
            visible_check = window.connect("notify::visible",()=> {
                updateVisible(window.get_visible());
            })
            onCleanup(()=> {
                window.disconnect(visible_check);
            })
        }
    } }

    onClicked={()=> {
        if(window) {
            const visible = window.visible;
            window.set_visible(!visible);
            
        }

    }}
    
    class={classes}>
      
        <box spacing={3}><BluetoothIcon/>
        <WifiIcon />
        <AudioIcon /></box>

        
        
    </button>
}