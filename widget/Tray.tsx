//@ts-ignore
import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app"
import { createBinding, createComputed,  } from "gnim";
import Graphene from "gi://Graphene?version=1.0";
import { Astal } from "ags/gtk4";
import TrayWindow from "./Tray/TrayWindow";

export default function Tray() {
     let box:Gtk.Widget;
     return <box/>
   /* const trayPopUp= app.get_window("TRAY_WINDOW") as Astal.Window;
    if(!trayPopUp) return <label/>;
   


    const popupOpen = createBinding(trayPopUp,"visible");

    const rotate = createComputed(()=> {
        const iconName = "banana-chevron-up-symbolic"
        return (popupOpen())? iconName.replace("up","down"):iconName
    })
    const popupState = createComputed(()=>popupOpen()?false:true)

    const positionWindow = (box:Gtk.Widget,window: Astal.Window,anchor:"left"|"right"|"center") => {
        const width = box.get_size(Gtk.Orientation.HORIZONTAL)
        const {BOTTOM,RIGHT,LEFT} = Astal.WindowAnchor
        let anchorPos = BOTTOM|LEFT;
        const root = box.get_root()
        if(!root) return ; 
        console.log(root.get_size(Gtk.Orientation.HORIZONTAL))
        const [_,{x,y}] = root.compute_point(box,new Graphene.Point({x:0,y:0}))
        const leftD = Math.abs(x);
        let margin:number; 
        switch (anchor) {
            case "left": {
                margin=leftD;
                anchorPos=BOTTOM|LEFT
                window.set_anchor(anchorPos);
                window.set_margin_left(leftD);
                return ; 
            }
        }

       


    }

*/

   
const rotate = "banana-chevron-up-symbolic"

    return <menubutton
    
            $={(self) => {
            box = self
            }}
    class={"button container-spacer"}>
        <image iconName={rotate} />

      <TrayWindow/>
    </menubutton>
}