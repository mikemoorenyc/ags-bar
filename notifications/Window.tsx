import AstalNotifd from "gi://AstalNotifd"
import { createBinding, createComputed, For, With } from "ags"
import { Astal, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Notification from "./Notification"
import Adw from "gi://Adw?version=1"

export const WINDOW_NAME = "NOTIFICATIONS_WINDOW"


export default function () {
    const {TOP,RIGHT} = Astal.WindowAnchor

    const notifd = AstalNotifd.get_default()
    
    const notifications = createBinding(notifd, "notifications")

    const l = notifications(n=>n.length > 0)

    
    
    const ns = createComputed(()=> {
        const list = notifications()

    // Track length so removals trigger recompute
    list.length
        return [...notifications()].sort((a,b)=> {
        return a.time - b.time;
    })
    })

    const list = createBinding(notifd, "notifications").as((notifs) =>
      notifs.sort((a, b) => b.time - a.time),
   );

    return <window 
    visible={l}
 
    widthRequest={200}
    anchor={TOP|RIGHT}
    marginRight={10}
    marginTop={10}
    layer={Astal.Layer.OVERLAY}
    application={app}
    name={WINDOW_NAME}
    namespace={WINDOW_NAME}
    $={self => {
        notifd.set_default_timeout(5000);
        

    }

    }
    >

       <Adw.Clamp maximumSize={344}>

         
         <box widthRequest={344} spacing={8} orientation={Gtk.Orientation.VERTICAL}>
           <For each={list}>{
               (n) => <Notification n={n} />
            }</For>

        </box>
        </Adw.Clamp>
        
       

    </window>
}


/*      */