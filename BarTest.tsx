import app from "ags/gtk4/app"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import ControlPanelButton from "./widget/ControlPanel/TaskbarButton"
import Launcher from "./widget/Launcher"
import Clock from "./widget/Clock"
import Pomo from "./widget/Pomo"

import { createBinding, createEffect ,createComputed} from "gnim"
// @ts-ignore

import Tray from "./widget/Tray"
import Microphone from "./widget/Microphone"

import ScreenRecording from "./widget/ScreenRecording"
import UpdateAvailable from "./widget/UpdateAvailable"
import Weather from "./widget/Weather"
import StartSpacer from "./widget/StartSpacer"



export default function Bar(gdkmonitor: Gdk.Monitor) {
  
  const { BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor

  const layer = Astal.Layer


 // const [isVisible,updateIsVisible] = createState(true)

  
  

  return (
    <window
      visible={true}
      name="BAR_WINDOW"
      namespace={"BAR_WINDOW"}
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={BOTTOM | LEFT | RIGHT}
      application={app}
      layer={layer.TOP}
      $={self => {
        setTimeout(()=> {
          self.set_layer(layer.TOP);
        },3000)
      }}
 
    >
      <centerbox class={"barCenterBox"} orientation={Gtk.Orientation.HORIZONTAL}>
        <box $type="start">
          <Launcher />
          <StartSpacer/>
       
          
      
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
