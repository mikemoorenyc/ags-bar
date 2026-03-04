import { execAsync } from "ags/process"

type TQuickActionButton = JSX.IntrinsicElements["button"]& {
    exec:string,
    closeWindow:()=>void,
    iconName:string,
    tooltip:string
}

const QuickActionButton = ({exec,closeWindow,iconName,tooltip}:TQuickActionButton) => {

    const buttonClick = () => {
        closeWindow(); 
        execAsync(exec);
        
    }
    return <button tooltipText={tooltip} class="quick-action-button" onClicked={()=>{buttonClick()}}>
        <image iconName={iconName} pixelSize={14} />
    </button>
}  



type QuickActions = JSX.IntrinsicElements["centerbox"] & {
    closeWindow: () =>void
}

type TActionSchema = [string,string][]

export default function QuickActions({closeWindow}:QuickActions) {

    const actionButtons : TActionSchema = [
        ["colorpicker","hyprpicker"],
        ["screenshot","omarchy-cmd-screenshot"],
        ["screenrecord","banana-cmd-screenrecord"]
    ]
    return <centerbox class={"quick-actions"}>
        <box $type="start" spacing={2}>
            <QuickActionButton iconName={"banana-shutdown-symbolic"} exec="ags request launcherstate system --instance my-shell" closeWindow={closeWindow} tooltip={"Shutdown"}/>
            

        </box>
        <box spacing={2} $type="end">
            <QuickActionButton tooltip="Settings menu" iconName={"banana-settings-symbolic"} exec="omarchy-menu" closeWindow={closeWindow} />
            <QuickActionButton tooltip={"System monitor"} iconName={"banana-systemmonitor-symbolic"} exec="omarchy-launch-or-focus-tui btop" closeWindow={closeWindow} />
        </box>
    </centerbox>
}