import { Gtk } from "ags/gtk4";

//@ts-ignore
import Wp from "gi://AstalWp"
import { createBinding, createComputed, createState ,onCleanup} from "ags";
import { timeout } from "ags/time";

export const [visible, setVisible] = createState(false);


export default function OSD() {
    const wireplumber = Wp.get_default(); 
    const speaker = wireplumber?.get_default_speaker();

    let firstStart = true;
    let count = 0;
    function show() {
      setVisible(true);
      
   
      count++;

      timeout(.75 * 1000, () => {
         count--;
         if (count === 0) {
            setVisible(false)
         }
      });
    }
    
    const df = createBinding(wireplumber,"default-speaker");
    const dfVolume = createBinding(df(), "volume");
    const muted = createBinding(df(), "mute" );
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
    const levelString = createComputed(()=>volLevel().toString())
    const highlightWidth = createComputed(()=> `min-width: ${Math.floor(dfVolume() * 110)}px;`)


    return <box 
    $={self => {
        timeout(500, () => (firstStart = false));
        if(!speaker) {
            console.log("no speaker");
            return ; 
        }
        const volumeconnect = speaker.connect("notify::volume", () => {
                  if (firstStart) return;
                  show();
        });
        const muteconnect = speaker.connect("notify::mute", () => {
            if (firstStart) return;
            show();
        });
        onCleanup(() => {
            speaker.disconnect(volumeconnect);
            speaker.disconnect(muteconnect);
        });
    }}
    
    
    homogeneous={false}  spacing={12} class={"osd-container popover-styles-base"} halign={Gtk.Align.CENTER} >
         
                <image valign={Gtk.Align.CENTER} vexpand={false}  iconName={volIcon} pixelSize={20} />
             
                <box  valign={Gtk.Align.CENTER} vexpand={false} class={"volume-slider-trough"}>
                    <box class={"volume-slider-highlight"} css={highlightWidth} />
                </box>
                <label  valign={Gtk.Align.CENTER} vexpand={false} xalign={1} class={"volume-number"} label={levelString}></label>
    </box>
}