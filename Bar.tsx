import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"

import Launcher from "./widget/Launcher"
import Clock from "./widget/Clock"
import Pomo from "./widget/Pomo"
import Workspaces from "./widget/Workspaces"
import { createBinding, createEffect ,createComputed} from "gnim"
// @ts-ignore
import AstalHyprland from "gi://AstalHyprland?version=0.1";

export default function Bar(gdkmonitor: Gdk.Monitor) {
  
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const layer = Astal.Layer
  const hyprland = AstalHyprland.get_default(); 
  const hypr = createBinding(hyprland,"clients");

 // const [isVisible,updateIsVisible] = createState(true)

  
  
  const isVisible = createComputed(()=> {
    let showBar = true
    hypr().forEach((element:any) => {
      const monitor = element.get_monitor();
      const mH = monitor.get_height();
      
      if(element.get_height() >= mH) {
        showBar = false;
        return false;  
      } 
    });
    return showBar;
  })

  return (
    <window
      visible={isVisible}
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      layer={layer.BACKGROUND}
    >
      <centerbox orientation={Gtk.Orientation.HORIZONTAL}>
        <box $type="start">
          <Workspaces/>
          <Pomo/>

        </box>
     
        <box $type="center">
          <Launcher />
        </box> 
   
        <box $type="end">
            <Clock monitor={gdkmonitor}/>
        </box>
      </centerbox>
    </window>
  )
}
