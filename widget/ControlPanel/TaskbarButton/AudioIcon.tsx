import { Wireplumber } from "../../../util/wireplumber"
//@ts-ignore
import Wp from "gi://AstalWp"
import { createBinding, createComputed, createEffect } from "ags";

export default function AudioIcon() {

    const wireplumber = Wp.get_default(); 

    const df = createBinding(wireplumber,"default-speaker");
    const dfVolume = createBinding(df(), "volume");
    const muted = createBinding(df(), "mute" );
    const volString = createComputed(()=>Math.floor(dfVolume() * 100).toString()+"%");
    const volIcon = createComputed(()=>muted()? "banana-speaker-mute-symbolic":"banana-speaker-symbolic");




return <box class={"taskbar-icon"}>
    <image class={"volume-icon"} iconName={volIcon} pixelSize={14} />
    <label class={"volume-percent"} label={volString}/>
</box>
}