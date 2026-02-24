//@ts-ignore
//@ts-ignore
import Wp from "gi://AstalWp"
import { createBinding, createComputed, createEffect } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import AudioIcon from "../ControlPanel/TaskbarButton/AudioIcon"
import { execAsync } from "ags/process"


export default function VolumeSlider({closeWindow}:{closeWindow:()=>void}) {
    const wireplumber = Wp.get_default(); 
    
    const df = createBinding(wireplumber,"default-speaker");
        const dfVolume = createBinding(df(), "volume");
    


    return<box valign={Gtk.Align.CENTER}>
        <button onClicked={()=> {
            execAsync("pamixer -t")
        }}>
            <AudioIcon type="button" />
        </button>
        <slider 
        value={dfVolume}
        onChangeValue={(self) => {
          df().volume = self.value
        }}
         hexpand/>
        <button class="button"onClicked={()=> {
            closeWindow();
            execAsync("omarchy-launch-audio")
        }}>
            <image iconName={"banana-device-eq-symbolic"} pixelSize={20} />
        </button>
    </box>
}