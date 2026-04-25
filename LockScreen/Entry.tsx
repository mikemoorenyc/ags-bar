import app from "ags/gtk4/app"
import AstalAuth from "gi://AstalAuth?version=0.1"
import { createComputed, createState, onCleanup } from "gnim"
import Gtk from "gi://Gtk?version=4.0"
import Gdk from "gi://Gdk?version=4.0"
import { execAsync } from "ags/process"


export default function Entry () {
    let pam = new AstalAuth.Pam()
    let refocusCheck:number; 
    let input:Gtk.Entry
    const pamConnections:number[]=[];
   
    const [inputState,updateInputState]= createState<"idle"|"typing"|"checking"|"error">("idle")
    const entryClasses = createComputed(()=> {
        const classes = ["lockscreen-entry"];
     
        classes.push(inputState())
        return classes
    })
    
    


    const textBuffer = new Gtk.EntryBuffer()

    



    return <box orientation={Gtk.Orientation.VERTICAL} hexpand halign={Gtk.Align.CENTER} spacing={10} class={"entry-container"}><entry 
    halign={Gtk.Align.CENTER}
    placeholderText={"Enter password"}
    secondaryIconName={"banana-spinner-symbolic"}
    
    canFocus={true}
    cssClasses={entryClasses}
    buffer={textBuffer}
    visibility={false}
    onNotifyText={()=>{updateInputState("typing")}}
    onActivate={()=> {
        const state = inputState();
        if(state === "checking") {
            return
        }
        updateInputState("checking");
        
         pam.supply_secret(textBuffer.text)
    }}

    $={self=> {
       // self.grab_focus();
       input = self
        
       refocusCheck = app.connect("request",(app, [cmd, arg, ...rest], response)=> {
            if(cmd !== "lockscreen") return ;

            if(arg == "refocus") {
                setTimeout(()=> {
                    input.grab_focus(); 
                },100)
            }
            
            
        })
        execAsync("ags request pomo stop -i my-shell")
        
        onCleanup(()=> {
            app.disconnect(refocusCheck);
            pamConnections.forEach(p => {
                pam.disconnect(p);
            })
        })

        setTimeout(()=> {
            self.grab_focus();
        },100)
        pamConnections.push(pam.connect("auth-prompt-visible", (auth, msg) => {
                console.log("[Lock Screen]:", `visible: ${msg}`)
        }))
        
        pamConnections.push(pam.connect("auth-prompt-hidden", (auth, msg) => {
                console.log("[Lock Screen]:", `hidden: ${msg}`)
        }))
        
        pamConnections.push(pam.connect("success", () => {
            console.log("successful log") 
            const win = app.get_window("LOCKSCREEN_WINDOW")
            execAsync("loginctl unlock-session")
           
            if(win) {
                win.close(); 
            } 
        }))
        pamConnections.push(pam.connect("fail", (auth, msg) => {
            console.log("fail")
            
            textBuffer.set_text("", -1)
            updateInputState("error")
            pam.start_authenticate();

        }))
        pamConnections.push(pam.connect("auth-error", (auth, msg) => {
            console.log("error")
        }))

            pam.start_authenticate()
    }}
    
    >
    <Gtk.EventControllerKey 
    onKeyPressed={(_,key)=> {
        if(key === Gdk.KEY_Escape) {
            const win = app.get_window("LOCKSCREEN_WINDOW")
            if(win) {
                win.close(); 
            }
            return true
        }
    }}
    />

        </entry>
    <label label={"Incorrect password"} class={inputState(i => "error-text "+i)}/>
        </box>
}