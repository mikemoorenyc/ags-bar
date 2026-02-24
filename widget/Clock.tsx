import { createPoll } from "ags/time"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { createComputed } from "gnim";
export default function Clock({monitor}:{monitor:Gdk.Monitor}) {
   const time = createPoll("", 1000 * 60, 
    `date +"%I:%M%p#%m/%d/%y"`)
    const calendarPopUp = app.get_window("CALENDAR_WINDOW");
    const timeofday = createComputed(()=>time()?time().split("#")[0]:"");
    const date = createComputed(()=>time()?time().split("#")[1]:"");

    
    


    return (
        <box  class=" clockContainer container-spacer">

          <button class={"button clockButton"} onClicked={()=> {
            if(!calendarPopUp) return ;
            calendarPopUp.set_visible(!calendarPopUp?.get_visible());
          }}>
          <box orientation={Gtk.Orientation.VERTICAL}>
            <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.END}class={" clockLabel"}  label={timeofday} />
            <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.END}class={" clockLabel"}  label={date} />
            
          </box>
    
        </button>
      
        </box>
    )
}