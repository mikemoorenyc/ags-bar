import app from "ags/gtk4/app"
import AstalAuth from "gi://AstalAuth?version=0.1"
import { createState } from "gnim"
import Gtk from "gi://Gtk?version=4.0"


export default function Entry () {
    let pam = new AstalAuth.Pam()
    const [text,updateText] = createState("")

    const textBuffer = new Gtk.EntryBuffer()
    return <entry 
    buffer={textBuffer}
    visibility={false}

    onActivate={()=> {
        const t = text();
          pam.supply_secret(textBuffer.text)
    }}
    $={self=> {
       // self.grab_focus();

        setTimeout(()=> {
       //     self.grab_focus();
        },100)
        pam.connect("auth-prompt-visible", (auth, msg) => {
                console.log("[Lock Screen]:", `visible: ${msg}`)
        })

        pam.connect("auth-prompt-hidden", (auth, msg) => {
                console.log("[Lock Screen]:", `hidden: ${msg}`)
        })

        pam.connect("success", () => {
            console.log("successful log")  
        })

        pam.connect("fail", (auth, msg) => {
            console.log("fail")
            textBuffer.set_text("", -1)
            pam.start_authenticate();

        })

        pam.connect("auth-error", (auth, msg) => {
            console.log("error")
        })

            pam.start_authenticate()
    }}
    
    >

        </entry>
}