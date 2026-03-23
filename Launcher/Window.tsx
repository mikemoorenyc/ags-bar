
import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Gdk from "gi://Gdk?version=4.0"
import Graphene from "gi://Graphene?version=1.0"
import { createComputed, createState, onCleanup } from "gnim"
import Menu from "./Menu"
import { With } from "gnim"
import { updateCurrentActive,currentActive } from "./Menu"
import AppWindow from "./AppWindow"
import WallPaper from "./Wallpaper"

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
    
    const [backstate,updateBackstate] = createState<null|string>(null)
    const {BOTTOM,LEFT,RIGHT,TOP} = Astal.WindowAnchor
    let win:Astal.Window;    
    let box: Gtk.Box
    let child: Gtk.Widget
    let visibleWatcher:number; 
    let closer:number;
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
        visibleWatcher = app.connect("request",(app, [cmd, arg, ...rest], response)=> {
            if(cmd !== "launcherstate") return ;

            const backs=rest.find(r => r.startsWith("backstate="));
            if(backs) {
                updateBackstate(backs.split("=")[1])
            } else {
                updateBackstate(null)
            }
            launcherSignal(arg)

            response(arg);
        })
        win.connect("notify::visible",()=> {
            if(win.get_visible()) {
                ["CALENDAR_WINDOW","QUICKSETTINGS_WINDOW"].forEach(w=> {
                    const window = app.get_window(w);
                    if(window) {
                        window.hide(); 
                    }
                })
            }
        })
        onCleanup(()=> {
            app.disconnect(visibleWatcher);
        })

       
     
        


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
    layer={Astal.Layer.OVERLAY}
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
                return <AppWindow window={win} backstate={backstate}/>
            }
            if(state == "empty") {
                return <box/>
            }
            if(state=="wallpaper") {
                return <WallPaper window={win} backstate={backstate} />
            }
            return <Menu window={win} state={state} backstate={backstate} />
        }
        return <box>
            {tester(state)}
        </box>
       }}
       </With>
        
        
        </box>
    </window>
}