//@ts-ignore
//@ts-ignore
import AstalWp from "gi://AstalWp"
import { createBinding, createComputed, createEffect } from "ags";
import Gtk from "gi://Gtk?version=4.0";
import AudioIcon from "../ControlPanel/TaskbarButton/AudioIcon"
import { execAsync } from "ags/process"


export default function VolumeSlider({closeWindow}:{closeWindow:()=>void}) {
  
    
    const df = AstalWp.get_default()?.audio!.defaultSpeaker!;
        const dfVolume = createBinding(df, "volume");
        const name = createBinding(df,"device","description")

        const n = createComputed(()=>name()||"")
    


    return<box orientation={Gtk.Orientation.VERTICAL} spacing={0}>
        <box valign={Gtk.Align.CENTER} >
        <button onClicked={()=> {
            execAsync("pamixer -t")
        }}>
            <AudioIcon type="button" />
        </button>
        <slider 
        value={dfVolume}
        onChangeValue={(self) => {
          df.volume = self.value
        }}
         hexpand/>
        <button class="button"onClicked={()=> {
            closeWindow();
            execAsync("omarchy-launch-audio")
        }}>
            <image iconName={"banana-device-eq-symbolic"} pixelSize={20} />
        </button>
    </box>
    <label class={"speaker-label"} label={n} />

    </box>
}