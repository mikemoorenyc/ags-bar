import { Gtk } from "ags/gtk4"
import { execAsync } from "ags/process"
import { Accessor, createComputed } from "gnim"
import Pango from "gi://Pango?version=1.0"

type TButtonProps = JSX.IntrinsicElements["box"] & {
  
    buttonClick:()=> void,
    exec?: string|Accessor<string>,
    label: string|Accessor<string>,
    iconName:string |Accessor<string>,
    extraClasses?:string | Accessor<string>
}

export default function Button (props:TButtonProps) {
    const {iconName,label,buttonClick,extraClasses} = props
    
    const settingsClass = createComputed(()=>{
        let base = "settings-button"
        if(!extraClasses) return base;
        if(typeof extraClasses == "string") {
            return base+" "+extraClasses
        }
        const ex = extraClasses();
        
      
        return base+" "+ex;
        
    } )
    

    const icon = createComputed(()=> {
        if(typeof iconName == "string") {
            return `banana-${iconName}-symbolic`
        }
        const iString = iconName(); 
        return `banana-${iString}-symbolic`
    })
    const l = createComputed(()=> {
        if(typeof label == "string") return label;
        return label(); 
    })

    

    return<box spacing={8}orientation={Gtk.Orientation.VERTICAL} class={"button-container"}>
        <button onClicked={()=>{buttonClick()}} class={settingsClass}>
            <image iconName={icon} pixelSize={24}/>
        </button>
        <label label={l} class={"settings-label"} maxWidthChars={10} ellipsize={Pango.EllipsizeMode.END} />
    </box>
}