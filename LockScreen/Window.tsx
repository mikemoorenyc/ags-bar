import app from "ags/gtk4/app"
import { Astal, Gtk } from "ags/gtk4"
import Entry from "./Entry"
import { createRoot, createState } from "gnim"
import Time from "./Time"
import System from "./System"
import { execAsync } from "ags/process"
import LockscreenWeather from "./LockscreenWeather"
export default function createLockScreen(arg?:string) {
    const {TOP,LEFT,BOTTOM,RIGHT} = Astal.WindowAnchor
    let win:Astal.Window
    
    let open = app.get_window("LOCKSCREEN_WINDOW");

    if(open) {
        return ; 
    }




    createRoot((dispose)=> {
        const bar = app.get_window("BAR_WINDOW")

        if(bar) {
            bar.set_visible(false);
        }
        ["CALENDAR_WINDOW","QUICKSETTINGS_WINDOW","LAUNCHER_WINDOW"].forEach(w=> {
            const window = app.get_window(w);
            if(window) {
                window.hide(); 
            }
        })
        

        return <window
        $={self=>{
            win=self;
        }}
        anchor={TOP|LEFT|BOTTOM|RIGHT
        }
        class={"lockscreen"}
        monitor={0}
        
        onCloseRequest={()=> {
            dispose(); 
            if(bar) {
                execAsync("/home/admin/.config/ags/scripts/weather-fetch.sh")
                bar.set_visible(true);
            }
        }}
        name="LOCKSCREEN_WINDOW"
        namespace={"LOCKSCREEN_WINDOW"}
        application={app}
        visible={true}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        >
            <centerbox vexpand orientation={Gtk.Orientation.VERTICAL}>
                <box $type="start" vexpand>
                    <LockscreenWeather />
                </box>
        
                <box $type="center" orientation={Gtk.Orientation.VERTICAL}>
                    <Time/>
                    <Entry />
                </box>
                <box $type="end" vexpand >
                <System />
                </box>
            </centerbox>
         


        </window>
        
    })

    



    
}