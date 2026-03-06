import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import ControlPanelButton from "./widget/ControlPanel/TaskbarButton"
import Launcher from "./widget/Launcher"
import Clock from "./widget/Clock"
import Pomo from "./widget/Pomo"
import Workspaces from "./widget/Workspaces"
import { createBinding, createEffect ,createComputed} from "gnim"
// @ts-ignore
import AstalHyprland from "gi://AstalHyprland?version=0.1";
import Tray from "./widget/Tray"
import Microphone from "./widget/Microphone"
import { exec } from "ags/process"
import ScreenRecording from "./widget/ScreenRecording"
import UpdateAvailable from "./widget/UpdateAvailable"


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
      <centerbox class={"barCenterBox"} orientation={Gtk.Orientation.HORIZONTAL}>
        <box $type="start">
          <Launcher />
          <Workspaces/>
          

        </box>
        <box $type="center">
          <UpdateAvailable />
        </box>
     
    
        <box $type="end">
            <ScreenRecording />
            <Pomo/>
            <Tray/>
            <Microphone />
              <ControlPanelButton/>
            <Clock monitor={gdkmonitor}/>
        </box>
      </centerbox>
    </window>
  )
}
