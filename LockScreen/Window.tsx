import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Entry from "./Entry"

export default function LockScreen() {
    const {TOP,LEFT,BOTTOM,RIGHT} = Astal.WindowAnchor
    let win:Astal.Window

    return <window
    visible={true}
    anchor={TOP|RIGHT}
    keymode={Astal.Keymode.ON_DEMAND}
    name={"LOCKSCREEN_WINDOW"}
    namespace={"LOCKSCREEN_WINDOW"}
    application={app}
    $={self=> {
        win=self
    }}
    >
        <box>
             <Entry />
        </box>


    </window>
}