import { Gtk } from "ags/gtk4";
import Astal from "gi://Astal?version=4.0"
import { createState } from "gnim";
import KeyController from "../KeyController";
import Adw from "gi://Adw?version=1";

export default function AppWindow ({window}:{window:Astal.Window}) {
    const [ready,updateReady] = createState(false);
    let mainBox:Gtk.Box

    return <box 
    $={self=>{
        mainBox=self
        
        updateReady(true);
    }}
    
    visible={true} vexpand>
                 <KeyController 
            escapeFunction={()=> {
                console.log(ready());
                if(!ready()) return true; 
                
                window.hide(); 
                return true; 
            }}
            upFunction={()=>true}
            downFunction={()=>true}
            returnFunction={()=>true}
        />
        
        <Adw.Clamp maximumSize={800}>
            <box orientation={Gtk.Orientation.VERTICAL} class={"launcher-menu app"}>
                <box class="header" hexpand>
                    <label label={"Applications"} class={"header-text"} />
                </box>
                <box class={"app-entry-container"} >
                    <entry
                    hexpand
                    placeholderText={"Search for apps"}
                    $={self=>{
                        self.set_focusable(true);
                        setTimeout(()=> {
                            self.grab_focus(); 
                        },100)
                    }}
                    >
               
                    </entry>
                </box>
            </box>
        </Adw.Clamp>


    </box>
}