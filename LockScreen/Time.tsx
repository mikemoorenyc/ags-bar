import { Gtk } from "ags/gtk4";
import { createPoll } from "ags/time";

export default function Time() {
    const time =  createPoll("", 1000 * 60, 
        `date +"%I:%M %p"`)

    const date = createPoll("", 1000 * 60, 
        `date +"%A %B %d"`)


    return <box valign={Gtk.Align.END} orientation={Gtk.Orientation.VERTICAL} hexpand class={"time-box"} $type="start" vexpand={true}
    
    >
        <label class={"time"} label={time} />
        <label class={"date"} label={date} />

    </box>
}