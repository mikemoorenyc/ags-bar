import { execAsync } from "ags/process"
import { Accessor } from "gnim"

type TProps = {
    label:Accessor<string>|string
    backstate?:Accessor<string|null>
}
export default ({label,backstate}:TProps) => {


    return <box class={"header header-styling"} spacing={12}>
        {(backstate && backstate())&& <button 
        
        onClicked={async () => {
            execAsync(`ags request launcherstate ${backstate()} -i my-shell`)
        }}
        
        >
            <image pixelSize={24} iconName={"banana-chevron-left-symbolic"}/>

            </button>}


                 <label xalign={0} hexpand label={label} class={"header-text"}/>
    </box>
}