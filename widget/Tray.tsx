//@ts-ignore
import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app"
import { createBinding, createComputed,  } from "gnim";
import Graphene from "gi://Graphene?version=1.0";
import { Astal } from "ags/gtk4";

export default function Tray() {
    const trayPopUp= app.get_window("TRAY_WINDOW") as Astal.Window;
    if(!trayPopUp) return <label/>;
    let box:Gtk.Widget;


    const popupOpen = createBinding(trayPopUp,"visible");

    const rotate = createComputed(()=> {
        return (popupOpen())? "transform:rotate(180deg);":"transform:none;"
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



   


    return <button
            onClicked={()=>{trayPopUp.set_visible(popupState());positionWindow(box,trayPopUp,"left")}}
            $={(self) => {
            box = self
            }}
    class={"button container-spacer"}>
        <image iconName={"banana-chevron-up-symbolic"} css={rotate}/>

      
    </button>
}