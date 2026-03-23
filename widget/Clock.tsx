import { createPoll } from "ags/time"
import { Astal, Gtk, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { createComputed, createState, onCleanup } from "gnim";
import StartSpacer from "./StartSpacer";
export default function Clock({monitor}:{monitor:Gdk.Monitor}) {
   const time = createPoll("", 1000 * 60, 
    `date +"%I:%M%p#%m/%d/%y"`)
    const calendarPopUp = app.get_window("CALENDAR_WINDOW");
    const timeofday = createComputed(()=>time()?time().split("#")[0]:"");
    const date = createComputed(()=>time()?time().split("#")[1]:"");
    const [calOpen,updateCalOpen] = createState(false);
    const buttonClasses = createComputed(()=> {
      let classes = "button container-spacer";
      if(calOpen()) {
        classes+= " active"
      }
      return classes
    })
    let visCheck:number
    


    return (
      <box 
      $={self => {
        if(!calendarPopUp) return ; 
        visCheck = calendarPopUp.connect("notify::visible",()=> {
          updateCalOpen(calendarPopUp.get_visible())
        })
        onCleanup(()=> {
          calendarPopUp.disconnect(visCheck);
        })
      }}
      >
        <StartSpacer />
          <box class={"clockButton"}orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.FILL}>
            <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.END}class={" clockLabel"}  label={timeofday} />
            <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.END}class={" clockLabel"}  label={date} />
            
          </box>
        <button onClicked={()=> {
            if(!calendarPopUp) return ;
            calendarPopUp.set_visible(!calendarPopUp?.get_visible());
          }} class={buttonClasses}>
          <image iconName={"banana-calendar-symbolic"} pixelSize={20}/>
        </button>
      
      </box>

    )
}


/*


        <box valign={Gtk.Align.CENTER} class=" clockContainer container-spacer">

          <button valign={Gtk.Align.CENTER} class={"button clockButton"} onClicked={()=> {
            if(!calendarPopUp) return ;
            calendarPopUp.set_visible(!calendarPopUp?.get_visible());
          }}>
          <box orientation={Gtk.Orientation.VERTICAL} valign={Gtk.Align.CENTER}>
            <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.END}class={" clockLabel"}  label={timeofday} />
            <label justify={Gtk.Justification.RIGHT}halign={Gtk.Align.END}class={" clockLabel"}  label={date} />
            
          </box>
    
        </button>
      
        </box>*/