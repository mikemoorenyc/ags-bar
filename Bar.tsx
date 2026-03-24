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
import Weather from "./widget/Weather"
import StartSpacer from "./widget/StartSpacer"
import LockscreenWeather from "./LockScreen/LockscreenWeather"


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
      name="BAR_WINDOW"
      namespace={"BAR_WINDOW"}
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      layer={layer.BOTTOM}
      $={self => {
        setTimeout(()=> {
          self.set_layer(layer.BOTTOM);
        },3000)
      }}
 
    >
      <centerbox class={"barCenterBox"} orientation={Gtk.Orientation.HORIZONTAL}>
        <box $type="start">
          <Launcher />
          <StartSpacer/>
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
              <Weather />
            <Clock monitor={gdkmonitor}/>
        </box>
      </centerbox>
    </window>
  )
}
