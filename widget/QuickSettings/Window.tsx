import { Node, onCleanup } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Graphene from "gi://Graphene?version=1.0"
import QuickSettingsTsx from "."

export default function QuickSettings() {
    let win: Astal.Window;
    let child: Gtk.Widget
    const {BOTTOM,RIGHT,LEFT} = Astal.WindowAnchor
    const windowName = "QUICKSETTINGS_WINDOW";
    onCleanup(() => {
        win.destroy()
    })
    return <window
        $={self=> {
            win = self;
            child = self.child
            
        }}
        visible={false}
        name={windowName}
        namespace={windowName}
        layer={Astal.Layer.OVERLAY}
        application={app}
        anchor={BOTTOM|RIGHT}
        monitor={0}
        marginBottom={8}
        marginRight={8}
        keymode={Astal.Keymode.EXCLUSIVE}
        

    >
        <Gtk.EventControllerKey
            onKeyPressed={({ widget: win }, key: number) => {
            if (key === Gdk.KEY_Escape) {
                win.hide()
                return true
            }
            }}
        />
        <Gtk.GestureClick
            onReleased={({ widget: win }, _, x, y) => {
                console.log("quic cleck")
                const [, rect] = child.compute_bounds(win)
                const position = new Graphene.Point({ x, y })
    
                if (!rect.contains_point(position)) {
               
                win.visible = false
                return false
                }
                return true 
            }}
        />

        <QuickSettingsTsx windowName={windowName} />
    </window>


}