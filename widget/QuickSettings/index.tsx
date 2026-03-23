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

    
    
    return <box orientation={Gtk.Orientation.VERTICAL} class={"quick-settings-panel popover-styling"} overflow={Gtk.Overflow.HIDDEN}>

      <box class={"row-container"} orientation={Gtk.Orientation.VERTICAL} spacing={20}>
        <Gtk.FlowBox class={"button-row"} 
        maxChildrenPerLine={3}
      activateOnSingleClick={false}
      homogeneous
      rowSpacing={16}
      columnSpacing={16}
        
        >
            <BluetoothButton closeWindow={closeWindow} />
            <NetworkButton closeWindow={closeWindow} />
            <Button buttonClick={async ()=> {
               
                closeWindow(); 
               const t= await execAsync("hyprpicker -a");
              
               
                
                
                
                
            }} label={"Colorpicker"} iconName="colorpicker" exec="hyprpicker" />
            <Button buttonClick={async ()=> {
                await execAsync("omarchy-cmd-screenshot")
                closeWindow(); 
                
            }} label={"Screen capture"} iconName="screenshot" />
            <Button buttonClick={async ()=> {
               await execAsync("banana-cmd-screenrecord")
                closeWindow(); 
            
            }} label={"Screen record"}  iconName="screenrecord" />
          
            <NightlightButton />
          
        </Gtk.FlowBox>
        <VolumeSlider closeWindow={closeWindow}/>
      </box>
      <QuickActions closeWindow={closeWindow}/>
    </box>
}