import Gtk from "gi://Gtk?version=4.0";
import Astal from "gi://Astal?version=4.0";

const tester = () => {
    const win = new Astal.Window;

    const children = <box css="min-width:40px; min-height:40px; background:red;"></box> as  Gtk.Box  

    const {TOP,LEFT,BOTTOM,RIGHT} = Astal.WindowAnchor
    win.set_anchor(TOP|LEFT
    );
    win.set_name("TEST_WINDOW");
    win.set_namespace("TEST_WINDOW")
    win.set_monitor(0);
    win.set_visible(true)
    win.set_layer(Astal.Layer.BOTTOM)
    win.child = children

}

export default tester
