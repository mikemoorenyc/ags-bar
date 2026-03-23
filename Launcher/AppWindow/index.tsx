import { Gtk } from "ags/gtk4";
import Astal from "gi://Astal?version=4.0"
import { createComputed, createEffect,  createState, For, onCleanup, With,  } from "gnim";
import Adw from "gi://Adw?version=1";
import AstalApps from "gi://AstalApps?version=0.1";
import Gdk from "gi://Gdk?version=4.0";
import { Accessor } from "gnim";
import Pango from "gi://Pango?version=1.0";
import { readFileAsync, writeFileAsync } from "ags/file";
import { execAsync } from "ags/process";

const [text,updateText] = createState("");
const [active,updateActive] = createState(0)
const [mouseX,updateMouseX] = createState(0)
const apps = new AstalApps.Apps(); 
const pinnedPath = "/home/admin/.config/ags/pinnedApps.json"
let input: Gtk.Entry

let sWindow:Gtk.ScrolledWindow;

type TAppItemProps = {
    app:AstalApps.Application,
    index:Accessor<number>, 
    mainWindow: Astal.Window|null
}
const appSorter = (apps:AstalApps.Application[]) :AstalApps.Application[]=> {
    return [...apps].sort((a,b)=> a.name.localeCompare(b.name)).filter(a => !a.executable.includes("steam://rungameid"))
}
const list = createComputed(()=> {
    let results: AstalApps.Application[];
    
  if (text().length) {
        results = apps.fuzzy_query(text());
    } else {
        results = apps.get_list();
    }
    
    
    
    return [...appSorter(results)]; 
})
const [pinnedApps,updatePinnedApps] = createState<string[]>([])
const pinnedAppsFull = createComputed(()=> {
   let aa = apps.get_list(); 
   return aa.filter(a => {
    return pinnedApps().includes(a.entry+"-"+a.name); 
   })
})


const AppItem = ({app,index,mainWindow}:TAppItemProps)=> {
    const pinEntry = app.entry+"-"+app.name;
    const isPinned = createComputed(()=>pinnedApps().includes(pinEntry));
    const isActive=createComputed(()=> active() === index())
    const pinVisible = createComputed(()=>active() ===index()||isPinned() )
    const containerClass = createComputed(()=>isActive()?"app-item-container active big-raised":"app-item-container")
    let box:Gtk.Box
    let controller:Gtk.EventControllerMotion
    const pinIcon = createComputed(()=> isPinned()?"banana-pin-filled-symbolic":"banana-pin-empty-symbolic");

    createEffect(()=> {
        if(!isActive() || sWindow===null) {
            return ;  
        }
        const adj = sWindow?.get_vadjustment();
        if(!adj) return ;
        const window: Gtk.ScrolledWindow = sWindow!; 
        const h = window.get_height();
        if(h<100) return ;
        const viewTop = adj.get_value();
        const [ok, , y] = box.translate_coordinates(window, 0, 0);
        const paddingTop = box.get_style_context().get_padding().top;
        const paddingBottom = box.get_style_context().get_padding().bottom;

        if(y<0) {
            adj.set_value(viewTop-(Math.abs(y) + paddingTop));   
        }
        if(y > h) {
            adj.set_value((y+box.get_height()+viewTop+paddingBottom)-h);
        }
    })
    return ( 
        <box 
        class={containerClass} 
        $={self=>{
            box=self
        }}>
            <button 
            hexpand={true}
            
            onClicked={()=>{
                if(mainWindow) {
                    mainWindow.hide();
                }
                app.launch(); 
            }}>
                <Gtk.EventControllerMotion
                $={self => {
                    controller=self;
                }}
                onEnter={(s,d,e)=> {
                    if(d !== mouseX()) {
                        updateMouseX(d);
                        updateActive(index())
                    } 
                }}/>
                <box >
                    <image iconName={app.iconName} pixelSize={48} class={"app-icon"}/>
                    <box  valign={Gtk.Align.CENTER}orientation={Gtk.Orientation.VERTICAL} class="text" hexpand>
                        <label class={"title"} xalign={0} label={app.name} hexpand ellipsize={Pango.EllipsizeMode.END}/>
                        <label class={"description"} xalign={0} visible={app.description !== null} ellipsize={Pango.EllipsizeMode.END} label={app.description} hexpand/>
                    </box>
                </box>
            </button>
            <button class={"pin-container"} visible={pinVisible}
            onClicked={async()=> {
                const oldPin = pinnedApps(); 
                let newPin:string[]=[];
                if(!isPinned()) {
                    newPin = [...pinnedApps(),...[pinEntry]];
                } else {
                    newPin = pinnedApps().filter(a=>a!==pinEntry);
                }
                
                updatePinnedApps(newPin);
                input.grab_focus(); 
                try {
                    await writeFileAsync(pinnedPath,JSON.stringify(newPin));
                } catch{
                    execAsync('notify-send "error saving pin"');
                    updatePinnedApps(oldPin);
                }
            }}
            >
                <image iconName={pinIcon} pixelSize={24}/>
            </button>
        </box>
    )
}

const PinnedList = ({window}:{window:Astal.Window}) => {
    
    return <box orientation={Gtk.Orientation.VERTICAL}>
        <label label={"Pinned Apps"} xalign={0} class={"pinned-apps-header"}/>
        <box orientation={Gtk.Orientation.VERTICAL}>
            <For each={pinnedAppsFull} id={app=>app.entry+"-"+app.name}>
            {(app,index)=><AppItem mainWindow={window} app={app} index={index} />}
            </For>
        </box>
    </box>
}

const AppList = ({window}:{window:Astal.Window}) => {

    return(
    <scrolledwindow heightRequest={700} propagateNaturalHeight={true} maxContentHeight={700} 
    $={self => {
        sWindow=self
    }}
    >
        <box class={"app-list-container"} orientation={Gtk.Orientation.VERTICAL} hexpand={true} overflow={Gtk.Overflow.HIDDEN} >
            <With value={text}>
            {text=>text.length>0?<box  orientation={Gtk.Orientation.VERTICAL}><For each={list} id={app => `${app.entry}-${app.name}`}>
                {(app,index)=><AppItem mainWindow={window} app={app} index={index} />}
            </For></box>:<PinnedList window={window}/>}
            </With>
        </box>
    </scrolledwindow>    
    )
   
}

const Entry = ({window}:{window:Astal.Window}) => {
    let visibleWatcher:number; 
    

    const readPins = async() => {
        try {
            const pinstring = await readFileAsync(pinnedPath) as string;
            const toJson = JSON.parse(pinstring) as string[];
            updatePinnedApps(toJson);

        } catch (error) {
            console.log(error)
        }
    }

    return (
    <entry
    primaryIconName={"banana-search-symbolic"}
        class="entry"
        hexpand
        onActivate={()=>{
            const i = active();
            const apps = text().length>0? list():pinnedAppsFull();

            if(window) {
                window.hide();
                apps[i].launch();
            }     
        }}
        placeholderText={"Search for apps..."}
        onNotifyText={self=>{
            updateText(self.text);
            updateActive(0);
            const adj = sWindow.get_vadjustment();
            adj.set_value(0);
        }}  
        $={self=>{
            input=self
            self.set_focusable(true);
            setTimeout(()=> {
                self.grab_focus(); 
            },100)  
            readPins();       
            if(window) {
                visibleWatcher = window.connect("notify::visible",()=> {
                updateText("");
                    self.set_text("")
                    self.grab_focus();
                    updateActive(0);
                    const adj = sWindow.get_vadjustment();
                    adj.set_value(0);
                    readPins(); 
                })
                onCleanup(()=> {
                    if(window) {
                        window.disconnect(visibleWatcher);
                    }
                })
            }
            
        }}
        >
        <Gtk.EventControllerKey 
        onKeyPressed={(_,val)=> {
            const checker = (text().length > 0)?list():pinnedAppsFull();
            if(val == Gdk.KEY_Down) {
                if(active() < checker.length-1) {
                    updateActive(active()+1)
                }   
                return true; 
            }
            if(val==Gdk.KEY_Up) {   
                if(active() > 0) {
                    updateActive(active()-1);
                }
                return true
            }
            if(val == Gdk.KEY_Escape) {                
                if(window) {
                    window.hide();
                }
                return true;
            }
            return false;
        }}     
        />
    </entry>
        
    )

}

export default function AppWindow ({window,backstate}:{window:Astal.Window,backstate:Accessor<null|string>}) {   
    
    let mainBox:Gtk.Box

    return <box 
    $={self=>{
        mainBox=self     
    }}
    class={"app-launcher-container popover-styling"}
    overflow={Gtk.Overflow.HIDDEN}
    visible={true} vexpand>      
        <Adw.Clamp maximumSize={800}>
            <box overflow={Gtk.Overflow.HIDDEN}orientation={Gtk.Orientation.VERTICAL} class={"launcher-menu app"}>
                <box orientation={Gtk.Orientation.VERTICAL} class={"header-styling app-header"}>
                    <label label={"Applications"} class={"header-text app-header-text"} xalign={0}/>
                    <box class={"app-entry-container "} >
                        <Entry  window={window}/>
                    </box>
                </box>
                
                
                <box class={"menu-container"}>
                    <AppList window={window} />
                </box>
                
            </box>
        </Adw.Clamp>
    </box>
}

