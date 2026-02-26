import { Astal, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Adw from "gi://Adw?version=1";
import QuickActions from "./QuickActions";
import Button from "./Button";
import { execAsync,exec } from "ags/process";
import NightlightButton from "./NightlightButton";
import BluetoothButton from "./BluetoothButton";
import NetworkButton from "./NetworkButton";
import VolumeSlider from "./VolumeSlider";
type QuickSettingsProps = JSX.IntrinsicElements["box"] & {
    windowName:string
}

export default function ({windowName}:QuickSettingsProps) {

    const window =app.get_window(windowName);

    const closeWindow = () => {
        const window =app.get_window(windowName);
        if(window) {
            window.set_visible(false)
        }
    }
    
    if(window)return <box />

   
    
    return <box orientation={Gtk.Orientation.VERTICAL} class={"quick-settings-panel popover-styles-base"}>

      <box class={"row-container"} orientation={Gtk.Orientation.VERTICAL} spacing={20}>
        <Gtk.FlowBox class={"button-row"} 
        maxChildrenPerLine={3}
      activateOnSingleClick={false}
      homogeneous
      rowSpacing={20}
      columnSpacing={12}
        
        >
            <BluetoothButton closeWindow={closeWindow} />
            <NetworkButton closeWindow={closeWindow} />
            <Button buttonClick={async ()=> {
                
                exec("hyprpicker")
                closeWindow(); 
            }} label={"Colorpicker"} iconName="colorpicker" exec="hyprpicker" />
            <Button buttonClick={async ()=> {
                closeWindow(); 
                execAsync("omarchy-cmd-screenshot")
            }} label={"Screen capture"} iconName="screenshot" />
            <Button buttonClick={async ()=> {
                closeWindow(); 
                execAsync("omarchy-menu screenrecord")
            }} label={"Screen record"}  iconName="screenrecord" />
          
            <NightlightButton />
          
        </Gtk.FlowBox>
        <VolumeSlider closeWindow={closeWindow}/>
      </box>
      <QuickActions closeWindow={closeWindow}/>
    </box>
}