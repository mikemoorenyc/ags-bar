import { createPoll } from "ags/time"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
export default function Clock({monitor}:{monitor:Gdk.Monitor}) {
   const time = createPoll("", 1000 * 60, 
    `date +"%I:%M%p %m/%d/%y"`)
    const calendarPopUp = app.get_window("CALENDAR_WINDOW");

    
    


    return (
        <box  class=" clockContainer container-spacer">

          <button class={"button clockButton"} onClicked={()=> {
            if(!calendarPopUp) return ;
            calendarPopUp.set_visible(!calendarPopUp?.get_visible());
          }}>
          <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.START}class={" clockLabel"}  label={time} />
    
        </button>
      
        </box>
    )
}