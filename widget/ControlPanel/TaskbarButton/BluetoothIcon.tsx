//@ts-ignore;
import Bluetooth from "gi://AstalBluetooth"
import { createBinding, createComputed } from "gnim";

export default function BluetoothIcons() {
    const bluetooth = Bluetooth.get_default();

    const isVisible = createBinding(bluetooth, "isConnected");

    

    return (
        <box visible={isVisible} class={"taskbar-icon bluetooth-icon"}>
            <image iconName={"banana-bluetooth-symbolic"} pixelSize={16} />
        </box>
    );
}

//󰂯 