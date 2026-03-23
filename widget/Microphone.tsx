//@ts-ignore
import Wp from "gi://AstalWp"
import { Accessor, createBinding, createComputed } from "ags"
import { execAsync } from "ags/process";

export default function MicIcon() {
    const wp = Wp.get_default()
    const audio = createBinding(wp,"audio");
    const recorders:Accessor<Wp.AstalWpStream[]> = createBinding(audio(),"recorders");
    const defaultMic = createBinding(wp,"default-microphone");
    const micMuted = createBinding(defaultMic(),"mute")
    


    const micIcon = createComputed(() => {
       if(recorders().length < 1) return "banana-microphone-symbolic";
       return micMuted() ? "banana-microphone-mute-symbolic":"banana-microphone-symbolic";
    })

    const buttonClasses = createComputed(()=> {
        let classes = "mic-button button container-spacer";
        return micMuted()? classes+" alert":classes+" "
    })
    const clickMute = async()=> {
        console.log("clicked");
        execAsync("pamixer --default-source -t");
    }
    const showIcon = createComputed(()=>recorders().length > 0);
    return (
        <button
        
        onClicked={()=>{clickMute()}}
        visible={showIcon} class={buttonClasses}>
            <image iconName={micIcon} pixelSize={18}/>
        </button>
    )
}