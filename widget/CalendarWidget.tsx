
import { Gtk } from "ags/gtk4";
import { createBinding, createComputed, createState, For } from "ags";

import Calendar, { CalendarDay } from "../util/Calendar";
import { execAsync } from "ags/process";
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
   const [testData,updateTestData] = createState("thing");
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
            
            label={testData}
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

export default function CalendarWidget() {
   const weeks = createBinding(calendar, "calendar");
   const firstday=createComputed(()=> {
      weeks
   })

   return (
      <box
        class={"calendar-container popover-styling"}
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
   );
}