
import { Gtk } from "ags/gtk4";
import { createBinding, createComputed, createEffect, createState, For } from "ags";

import Calendar, { CalendarDay } from "../util/Calendar";
import { execAsync } from "ags/process";
import Adw from "gi://Adw?version=1";
const calendar = Calendar.get_default();

const WEEK_DAYS = ["M", "T", "W", "T", "F", "S", "S"];

function CalendarDayButton({ day }: { day: CalendarDay }) {
   const classes = ["calendar-button","day"];
   

   if (day.isToday) {
    classes.push("today")

   }
   else if (day.isWeekend && day.isOtherMonth)
      classes.push("other-month-weekend");
   else if (day.isOtherMonth) classes.push("other-month");
   else if (day.isWeekend) classes.push("weekend");

   return (
      <button cssClasses={classes} focusOnClick={false} >
         <box halign={Gtk.Align.CENTER} orientation={Gtk.Orientation.VERTICAL} >
            <label halign={Gtk.Align.CENTER} label={String(day.day)} />
            <box class="event-button" halign={Gtk.Align.CENTER} />
         </box>
      </button>
   );
}

function WeekDayHeader({ day, index }: { day: string; index: number }) {
   const isWeekend = index >= 5;

   return (
      <button
         cssClasses={["calendar-button", "weekday-button", isWeekend ? "weekend" : ""]}
         focusOnClick={false}
      >
         <box halign={Gtk.Align.CENTER}>
            <label halign={Gtk.Align.CENTER} label={day} />
         </box>
      </button>
   );
}

function Header() {

   const date = createBinding(calendar, "date");
   const monthLabel = createComputed(()=> {
    const month = date().toLocaleString("default", { month: "short" });
      const year = date().getFullYear();
      return `${month} ${year}`
   })
   const resetVisible = createComputed(()=> {
    const today = new Date(); 
    const isToday= date().getMonth() === today.getMonth() &&
         date().getFullYear() === today.getFullYear();
    return !isToday;
   })



   return (
      <box class={"header"} spacing={0} 
      $={self=> {
 
      }}
      
      >
        
         <label
         valign={Gtk.Align.CENTER}
            class={"monthyear"}
            
            label={monthLabel}
         />
         <box hexpand />
         <button class={"reset-button "}onClicked={() => calendar.reset()}
            focusOnClick={false} visible={resetVisible}>
            <image iconName={"banana-reset-symbolic"} pixelSize={14} />
        </button>
         <button
         valign={Gtk.Align.CENTER}
            focusOnClick={false}
            class={"monthshift button sm left"}
            onClicked={() => calendar.shiftMonth(-1)}
         >
            <image
               iconName={"banana-chevron-left"}
               pixelSize={16}
            />
         </button>
         <button
         valign={Gtk.Align.CENTER}
            focusOnClick={false}
            class={"monthshift button sm "}
            onClicked={() => calendar.shiftMonth(1)}
         >
            <image
               iconName={"banana-chevron-right"}
               pixelSize={16}
            />
         </button>
      </box>
   );
}
const createString = (date:Date) => {
   return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}
type TDate = {
      calendar :{
         calId: string,
         color:string,
         primary:boolean,
         title:string
      },
      title: string,
      start:{
         date?:string,
         dateTime?:string,
      },
      end:{
         date?:string,
         dateTime?:string,
      }
      location?:string
      id:string
   }
export default function CalendarWidget() {
   const weeks = createBinding(calendar, "calendar");
   const [dates,updateDates] = createState(["",""])
   const [events,updateEvents] = createState<TDate[]>([])

   const grabDates = async (start:string,end:string) => {
      const dates = await execAsync(`/home/admin/.config/ags/scripts/check-cal.sh --start ${start} --end ${end}`);
      console.log(dates);
   }
   
   createEffect(async()=> {
      const firstDay =createString(weeks()[0][0].date)
      const lastWeek = weeks()[weeks().length-1];
      const lastDay = createString(lastWeek[lastWeek.length-1].date);
      if(firstDay !== dates()[0]) {
         updateDates([firstDay,lastDay])
      //   grabDates(firstDay,lastDay);
         console.log(firstDay,lastDay);

      }
   })

   return (
      <box overflow={Gtk.Overflow.HIDDEN} class={"outer-container calendar-container popover-styling"}>
         <box
         
         class={" "}
         overflow={Gtk.Overflow.HIDDEN}
            $={(self) => {
               self.connect("map", () => calendar.reset());
            }}
            orientation={Gtk.Orientation.VERTICAL}
            spacing={0}
         >
            <box class={"top-section"} orientation={Gtk.Orientation.VERTICAL}>
               <Header />
            <box class={"weekdays"} spacing={0}>
               {WEEK_DAYS.map((day, index) => (
                  <WeekDayHeader day={day} index={index} />
               ))}
            </box>
            </box>
            <box
               spacing={0}
               class={"days"}
               orientation={Gtk.Orientation.VERTICAL}
            >
               <For each={weeks}>
                  {(week) => (
                     <box spacing={0} class={"week-row"}>
                        {week.map((day) => (
                           <CalendarDayButton day={day} />
                        ))}
                     </box>
                  )}
               </For>
            </box>
         </box>
       
      </box>
   );
}