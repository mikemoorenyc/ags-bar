
import {Gdk,Gtk,Astal} from "ags/gtk4";
import app from "ags/gtk4/app"
import { createComputed, onCleanup } from "gnim";
import Graphene from "gi://Graphene?version=1.0"
type BarItemPopupProps = JSX.IntrinsicElements["window"] & {
   children?: any;
   windowName:string,
   openPosition:"right"|"left",
   outsideClickCheck?: (d:boolean) => void
   
};


export default function BarPopUp({windowName,children,openPosition,outsideClickCheck}:BarItemPopupProps) {

    let win:Astal.Window;
    const {BOTTOM,RIGHT,LEFT} = Astal.WindowAnchor
    const anchorMap = new Map<"right"|"left",Astal.WindowAnchor>([
        ["right",RIGHT],["left",LEFT]
    ])

    

    onCleanup(() => {
        win.destroy()
      })
    return (
        <window
        $={(self) => {
            win = self
        }}
        visible={false}
        name={windowName}
        namespace={windowName}
        monitor={0}
        marginBottom={2}
        marginRight={8}
        application={app}
        keymode={Astal.Keymode.EXCLUSIVE}
        anchor={BOTTOM | (anchorMap.get(openPosition)||LEFT)}
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
                    console.log("clec")
                    
                    
                    const [, rect] = children?.compute_bounds(win)
                    const position = new Graphene.Point({ x, y })
                    if (!rect.contains_point(position)) {
                        win.visible = false
                        if(outsideClickCheck) {
                            outsideClickCheck(true)
                        }
                        return false
                    }
                    if(outsideClickCheck) {
                        outsideClickCheck(false)
                    }
                    return true
                }}
            />
        
              
                    {children}
              
         
        </window>
    )
}