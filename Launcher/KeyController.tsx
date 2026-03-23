import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0";

type ControllerProps = {
    upFunction: () => boolean,
    downFunction:() => boolean,
    escapeFunction:()=>boolean
}
export default function KeyController({downFunction,upFunction,escapeFunction}:ControllerProps) {


    return <Gtk.EventControllerKey 
        onKeyPressed={(_,key)=> {
            if(key == Gdk.KEY_Down) {
                return downFunction(); 
            }
            if(key == Gdk.KEY_Up) {
                return upFunction();
            }
            if(key == Gdk.KEY_Escape) {
                return escapeFunction();
            }
    
            return true ; 
        }}
    
    />
}