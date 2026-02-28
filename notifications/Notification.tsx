import { Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import AstalNotifd from "gi://AstalNotifd?version=0.1";
import { createComputed } from "gnim";
import GLib from "gi://GLib?version=2.0";


export default function ({n}:{n:AstalNotifd.Notification}) {
    const imageIsSymbol = (path:string) => {
        if(!path.length) return false; 
     
        const pathSplit = path.split("/");
        const filenameSplit = pathSplit[pathSplit.length - 1].split(".");
     
        if(filenameSplit.length > 1) return false; 
        return true; 
    }
    const headerIconCheck = ()=> {
        if(n.appIcon.length) return n.appIcon;
        if(n.desktopEntry.length) return n.desktopEntry;
        if(!n.image.length) return undefined;
        if(imageIsSymbol(n.image)) return n.image;

        return undefined; 
    }
    let cautionClass = "normal"
   
    switch (n.urgency) {
      case 0:
         cautionClass = "low"
         break;
      case 2:
         cautionClass = "critical"
         break;
      case 1:
      default:
         cautionClass = "normal";
   }
    let headerIcon = headerIconCheck(); 
    const imagePathCheck = () => {
        
        if(!n.image.length) return undefined;
      
        if(imageIsSymbol(n.image)) return undefined; 
   
        return n.image
    }
    let imagePath = imagePathCheck(); 
    
    const time = createComputed(()=> {
        
        const formatted = GLib.DateTime.new_from_unix_local(n.time).format("%I:%M%p")?.toString();
        if(!formatted) return "dead";
        return formatted; 
    })
    let showImage = n.appIcon.length||n.desktopEntry.length||n.image.length 
    if(cautionClass=="critical" && !showImage) {
        showImage = 1;
        headerIcon ="banana-warning-symbolic"
    }
    if(imagePath) {
        headerIcon = undefined;
    }

    
     return   <box
     cssClasses={["popover-styles-base","reverse","notification-popup",cautionClass]}
      widthRequest={360} orientation={Gtk.Orientation.VERTICAL}>
        <box spacing={8} class={"containing-box"}>
            {showImage&&<box cssClasses={["image-box",cautionClass]} valign={Gtk.Align.START} homogeneous={false}>
                <image  file={imagePath} vexpand={false}  iconName={headerIcon} pixelSize={36}/>
            </box>}
            <box orientation={Gtk.Orientation.VERTICAL} class={"main-content"}>
                <centerbox class={"header"}>
                    <box $type="start" class={"header-data"}>
                   {time() !== "dead"&&<label class={"timestamp"}  label={time}/>}
                    </box>
            
                    <button
                    onClicked={()=> {n.dismiss()}}
                    tooltipText={"Dismiss"} $type="end" class={"dismiss-button"}>
                        <image pixelSize={14} iconName={"banana-dismiss-symbolic"}/>
                    </button>
                </centerbox>
                <box class={"text"} orientation={Gtk.Orientation.VERTICAL} hexpand={true}>
                <label class={"summary"} xalign={0} label={n.summary} wrap={true} />
                {n.body&&<label class={"body"} xalign={0} label={n.body} wrap={true} />}
            </box>


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