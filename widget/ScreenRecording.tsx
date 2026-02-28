import { execAsync } from "ags/process"
import { createComputed, createState } from "gnim"

import GLibUnix from "gi://GLibUnix?version=2.0";
import GLib from "gi://GLib"



export default function ScreenRecording() {

const [recording,updateRecording] = createState("false")

const SIG = 34 + 8 // SIGRTMIN + 8

GLibUnix.signal_add_full(
    GLib.PRIORITY_DEFAULT,
    10,
    () => {
        myFunction()
        return GLib.SOURCE_CONTINUE
    }
)

async function myFunction() {
    try {

        
            const active = await execAsync(
                "/home/admin/.config/ags/scripts/screencheck.sh"
            )
            updateRecording(active);
        } catch(error) {
            throw new Error("ss")
        }
}

    

    

    return <box visible={createComputed(() => recording() !== "false")}>
        <button  class={"container-spacer button alert"}
        onClicked={()=>{execAsync('banana-cmd-screenrecord')}}
        >
          <image iconName={"banana-record-symbolic"} pixelSize={18}/>
        </button>
    </box>
}
  