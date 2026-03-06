import { Gtk } from "ags/gtk4";
import Astal from "gi://Astal?version=4.0"
import { createComputed, createEffect, createState, For, onCleanup, Setter } from "gnim";
import KeyController from "../KeyController";
import Adw from "gi://Adw?version=1";
import AstalApps from "gi://AstalApps?version=0.1";
import Gdk from "gi://Gdk?version=4.0";
import { Accessor } from "gnim";

import Pango from "gi://Pango?version=1.0";
import app from "ags/gtk4/app";

const [text,updateText] = createState("");
const [active,updateActive] = createState(0)
const apps = new AstalApps.Apps(); 

let sWindow:Gtk.ScrolledWindow;

type TAppItemProps = {
    app:AstalApps.Application,
    index:number, 
    sWindow: Accessor<Gtk.ScrolledWindow|null>
}


const AppItem = ({app,index}:TAppItemProps)=> {
    const isActive=createComputed(()=> active() === index)
    const pinVisible = createComputed(()=>active() ===index )
    const containerClass = createComputed(()=>isActive()?"app-item-container active":"app-item-container")
    let box:Gtk.Box

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


const viewBottom = viewTop + adj.get_page_size();

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
    

                return <box class={containerClass} 
                $={self=>{
                    box=self
                }}
                
                >
                    <button hexpand>
                    <Gtk.EventControllerMotion
                        onEnter={(s,d,e)=> {
                        updateActive(index)
                    }}
                    />
                    <box >
                        <image iconName={app.iconName} pixelSize={52}/>
                        <box orientation={Gtk.Orientation.VERTICAL} class="text" hexpand>
                            <label label={app.name} hexpand/>
                            <label ellipsize={Pango.EllipsizeMode.END} label={app.description} hexpand/>
                        </box>
                    </box>
                </button>
                <box class={"pin-container"} visible={pinVisible}>
                    <image iconName={"banana-pin-filled-symbolic" } />
                </box>

                </box>
}

const AppList = ({window}:{window:Astal.Window}) => {

   const [windowProp,updateWindowProp] = createState<null|Gtk.ScrolledWindow>(null)


const list = createComputed(()=> {
    let results: AstalApps.Application[];
  if (text().length) {
        results = apps.fuzzy_query(text());
    } else {
        results = apps.get_list();
    }
    // remove duplicates
    const unique = new Map<string, AstalApps.Application>();

    for (const app of results) {
        unique.set(app.entry, app);
    }
    return [...unique.values()].sort((a, b) =>
        a.name.localeCompare(b.name)
    );
})
    return<scrolledwindow heightRequest={700} propagateNaturalHeight={true} maxContentHeight={700} 
    $={self => {
        sWindow=self
    }}
    >

            <box class={"app-list-container"} orientation={Gtk.Orientation.VERTICAL} hexpand={true} overflow={Gtk.Overflow.HIDDEN} >
                <For each={list} id={app => `${app.entry}-${app.toString()}`}>
                    {(app,index)=><AppItem  app={app} index={index()} sWindow={windowProp} />}
                </For>
          
      
        </box>

    </scrolledwindow>
   


}
const Entry = () => {
    let visibleWatcher:number; 
    let input:Gtk.Entry;
    let window:Gtk.Window|undefined
    return <entry
                    class="entry"
                    hexpand
                    onActivate={()=>{console.log("activate")}}
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
                        window = app.get_window("LAUNCHER_WINDOW");
                        if(window) {
                            visibleWatcher = window.connect("notify::visible",()=> {
                            updateText("");
                                self.set_text("")
                                self.grab_focus();
                                updateActive(0);
                                const adj = sWindow.get_vadjustment();
                                adj.set_value(0);
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
                            if(val == Gdk.KEY_Down) {
                               /* if(active() < list().length-1) {
                                    updateActive(active()+1)
                                }*/
                               updateActive(active()+1);
                             
                                return true; 
                            }
                            if(val==Gdk.KEY_Up) {
                                if(active() > 0) {
                                    updateActive(active()-1);
                                }
                    
                                return true;

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
    

}
/*
<entry
                    class="entry"
                    hexpand
                    onActivate={()=>{console.log("activate")}}
                    placeholderText={"Search for apps..."}
                  
               
                    $={self=>{
                        input=self
                        self.set_focusable(true);
                        setTimeout(()=> {
                            self.grab_focus(); 
                        },100)
                        visibleWatcher = window.connect("notify::visible",()=> {
                            updateText("");
                            self.set_text("")
                            self.grab_focus();
                            updateActive(0);
                            const adj = sWindow.get_vadjustment();
                            adj.set_value(0);
                        })
                        onCleanup(()=> {
                            window.disconnect(visibleWatcher);
                        })
                    }}
                    >
                        <Gtk.EventControllerKey 
                        onKeyPressed={(_,val)=> {
                            if(val == Gdk.KEY_Down) {
                                if(active() < appListFiltered().length-1) {
                                    updateActive(active()+1)
                                }
                             
                                return true; 
                            }
                            if(val==Gdk.KEY_Up) {
                                if(active() > 0) {
                                    updateActive(active()-1);
                                }
                    
                                return true;

                            }
                            if(val == Gdk.KEY_Escape) {
                                window.hide();
                                return true;
                            }
                            return false;
                    
                        }}  
                        
                        />
                    </entry>
                    */
export default function AppWindow ({window}:{window:Astal.Window}) {
    const [ready,updateReady] = createState(false);

    const appListFiltered = createComputed(()=> {

        
       
    })
    
    let mainBox:Gtk.Box
    let input:Gtk.Entry
    let visibleWatcher:number; 
   

    return <box 
    $={self=>{
        mainBox=self
        
        updateReady(true);
    }}
    
    visible={true} vexpand>
                 
        
        <Adw.Clamp maximumSize={800}>
            <box overflow={Gtk.Overflow.HIDDEN}orientation={Gtk.Orientation.VERTICAL} class={"launcher-menu app"}>
                <label label={text} />
                <box class="header" hexpand>
                    <label label={"Applications"} class={"header-text"} />
                </box>
                <box class={"app-entry-container "} >
                    <Entry />
                </box>
                <box class={"menu-container"}>
                    <AppList window={window} />
                </box>
                
            </box>
        </Adw.Clamp>


    </box>
}

/*
ext={text.peek()}
        $={(self) => {
          app.connect("window-toggled", (_, win) => {
            const winName = win.name
            const visible = win.visible

            if (winName == WINDOW_NAME && visible) {
              setText("")
              self.set_text("")
              self.grab_focus()
            }
          })
        }}
        onNotifyText={({ text }) => {
          setText(text)
        }}
          */