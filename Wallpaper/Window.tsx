import { Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Astal from "gi://Astal?version=4.0"

export default function () {
    const {BOTTOM,RIGHT,LEFT,TOP} = Astal.WindowAnchor
    const win = new Astal.Window;
    let pic: Gtk.Picture
    return <window
    visible={true}
    monitor={0}
    name={"WALLPAPER_WINDOW"}
    namespace={"WALLPAPER_WINDOW"}
    layer={Astal.Layer.BACKGROUND}
    anchor={TOP|LEFT}
    keymode={Astal.Keymode.NONE}
    exclusivity={Astal.Exclusivity.IGNORE}
    focusable={false}
    $={self => {
            self.set_layer(Astal.Layer.BACKGROUND)
    }}
    >
    <box css={"min-width:50px; min-height:50px; background:red;"}></box>


    </window>
}