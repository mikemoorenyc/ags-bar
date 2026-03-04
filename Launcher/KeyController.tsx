import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0";

type ControllerProps = {
    upFunction: () => boolean,
    downFunction:() => boolean,
    returnFunction:() => boolean,
    escapeFunction:()=>boolean
}
export default function KeyController({downFunction,upFunction,returnFunction,escapeFunction}:ControllerProps) {


    return <Gtk.EventControllerKey 
        onKeyReleased={(_,key)=> {
            if(key == Gdk.KEY_Down) {
                return downFunction(); 
            }
            if(key == Gdk.KEY_Up) {
                return upFunction();
            }
            if(key == Gdk.KEY_Escape) {
                return escapeFunction();
            }
            if(key == Gdk.KEY_Return) {
                return returnFunction(); 
            }
            return true ; 
        }}
    
    />
}