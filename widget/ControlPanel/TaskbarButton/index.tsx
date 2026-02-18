import AudioIcon from "./AudioIcon"
import BluetoothIcon from "./BluetoothIcon"
import WifiIcon from "./WifiIcons"

export default function ControlPanelButton () {


    return <menubutton class={"container-button control-panel taskbar-button"}>
      
        <box><BluetoothIcon/>
        <WifiIcon />
        <AudioIcon /></box>

        
        
    </menubutton>
}