
//@ts-ignore
import Wp from "gi://AstalWp"
import { createBinding, createComputed} from "ags";
import Gtk from "gi://Gtk?version=4.0";
export default function AudioIcon({type}:{type?:string}) {

    const wireplumber = Wp.get_default(); 

    const df = createBinding(wireplumber,"default-speaker");
    const dfVolume = createBinding(df(), "volume");
    const muted = createBinding(df(), "mute" );
    const volString = createComputed(()=>Math.floor(dfVolume() * 100).toString()+"%");
    const volLevel = createComputed(()=>Math.floor(dfVolume() * 100))
    const volIcon = createComputed(()=>{
        const ic = "banana-speaker-XXXX-symbolic";
        if(muted()) return ic.replace("XXXX","mute");
        if(volLevel() === 0) return ic.replace("XXXX","off")
        if(volLevel() > 60) {
            return ic.replace("XXXX",'2');
        }
        if(volLevel() > 30) {
            return ic.replace("XXXX","1");
        }

        return ic.replace("XXXX","0")
    });
    const classes= createComputed(()=> {
        return type == "button"?"button":"taskbar-icon"
    })
    const size = createComputed(()=> {
        return type == "button"?20:16
    })




return <centerbox class={classes} halign={Gtk.Align.CENTER} tooltipText={volString}>
    <image $type="center" class={"volume-icon"} iconName={volIcon} pixelSize={size} />

</centerbox>
}