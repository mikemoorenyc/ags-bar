import { Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { createComputed } from "gnim";


export default function ({n}:{n:AstalNotifd.Notification}) {

    const headerIcon = createComputed(()=> {
        return n.appIcon||n.desktopEntry||"banana-alert-symbolic"
    })

    
     return   <box class={"popover-styles-base reverse notification-popup"} widthRequest={344} orientation={Gtk.Orientation.VERTICAL}>
        <box class={"header"}>
            <box >
                    <image iconName={headerIcon} pixelSize={16}></image>

            </box>
            <box hexpand={true} />
            <button
                onClicked={()=> {n.dismiss()}}
                tooltipText={"Dismiss"} $type="end" class={"button reverse dismiss-button"}>
                    <image pixelSize={14} iconName={"banana-dismiss-symbolic"}/>
                </button>
        </box>
        <box class={"content"}>
            {n.image && <box class={"icon-container"}><image file={n.image} class={"icon"}/></box>}
            <box class={"text"} orientation={Gtk.Orientation.VERTICAL} hexpand={true}>
                <label class={"summary"} xalign={0} label={n.summary} wrap={true} />
                {n.body&&<label class={"body"} xalign={0} label={n.body} wrap={true} />}
            </box>
        </box>
        

     </box>
   

}


/*
<box hexpand={false} class={"popover-styles-base reverse notification-popup"} name={n.id.toString()} orientation={Gtk.Orientation.VERTICAL} >
            <box class={"header"}>
                <box $type="start">
                    <image iconName={headerIcon} pixelSize={20}></image>

                </box>
                <button
                onClicked={()=> {n.dismiss()}}
                tooltipText={"Dismiss"} $type="end" class={"button reverse dismiss-button"}>
                    <image pixelSize={14} iconName={"banana-dismiss-symbolic"}/>
                </button>
            </box>
            
            <box class="text" hexpand={false} orientation={Gtk.Orientation.VERTICAL}>
                <label xalign={0} halign={Gtk.Align.START} class={"summary"} label={n.summary} wrapMode={Gtk.WrapMode.WORD_CHAR} wrap={true} maxWidthChars={30} hexpand={false}/>
                {n.body&&<label xalign={0} class={"body"} label={"This is a really long entry that flows onto multiple lines of text it goes on and on"} wrapMode={Gtk.WrapMode.WORD_CHAR} wrap={true} maxWidthChars={30}widthRequest={0} naturalWrapMode={Gtk.NaturalWrapMode.WORD}
hexpand={true}/>}

            </box>
        </box>
*/