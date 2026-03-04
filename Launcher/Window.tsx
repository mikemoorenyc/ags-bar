
import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import Graphene from "gi://Graphene?version=1.0"
import { createComputed, createState, onCleanup } from "gnim"
import Menu from "./Menu"
import { With } from "gnim"
import { updateCurrentActive,currentActive } from "./Menu"
import AppWindow from "./AppWindow"

const [launcherState,updateLauncherState] = createState<null|string>(null);
const name = "LAUNCHER_WINDOW"
export const launcherSignal = (signal:string) => {
    updateCurrentActive(0);
    const window = app.get_window(name);
    if(!app) return ; 
    if(signal == "empty") {
        window?.hide(); 
        updateLauncherState(null);
        return; 
    }
    window?.set_visible(true);
    updateLauncherState(signal);

}

export default function () {
    
    
    const {BOTTOM,LEFT,RIGHT,TOP} = Astal.WindowAnchor
    let win:Astal.Window;    
    let box: Gtk.Box
    let child: Gtk.Widget
    let visibleWatcher:number; 
    const testLabel = createComputed(()=> {
        
       if(launcherState()!== null) {
        return launcherState()||"dsfa"
       } else {
        return "ne"
       }
    })
    
    return <window
    $={self=> {
        win=self
        child = win.child

       
     
        


    }}

    visible={false}
    name={name}
    namespace={name}
    class="launcher"
    application={app}
    anchor={TOP|RIGHT|BOTTOM|LEFT
    }
    widthRequest={500}
    heightRequest={500}

    keymode={Astal.Keymode.EXCLUSIVE}
    >
    
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
       <box 
       $={self=> {
        box=self;
       }}
       
    
       
       
       halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER} vexpand={false} class={""}>
        
        
       <With value={launcherState}>
       {(state)=>{
        
        const tester = (state:string|null) => {
            if(state === null) {
                return <box/>
            }
            if(state == "apps") {
                return <AppWindow window={win} />
            }
            if(state == "empty") {
                return <box/>
            }
            return <Menu window={win} state={state} />
        }
        return <box>
            {tester(state)}
        </box>
       }}
       </With>
        
        
        </box>
    </window>
}