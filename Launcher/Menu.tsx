import {  readFileAsync } from "ags/file"
import { Astal, Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import { Accessor, createComputed,  createState, onCleanup, With } from "gnim";
import Pango from "gi://Pango?version=1.0";
import { execAsync} from "ags/process";
import getMenus from "./getMenus";
import Header from "./Header";


export type MenuItem = {
    label:string, 
    icon:string, 
    exec:string
}

export type Menu = {
    title:string,
    slug:string, 
    items: MenuItem[]
}
export const [currentActive,updateCurrentActive] = createState(0)


type ListItemProps = JSX.IntrinsicElements["button"] & {
    item:MenuItem,
    index:number,
    window:Astal.Window
}

const ListItem = ({item,index,window}:ListItemProps) => {
    const classes = createComputed(()=> {
        return currentActive() === index ? "list-button active big-raised":"list-button"
    })

   
    return (
    <button 
    
    $={(self)=> {


    }}

    onClicked={()=> {
        window.hide(); 
         execAsync(item.exec)
    }}
    class={classes} hexpand={true} >
        <Gtk.EventControllerMotion
        onEnter={(s,d,e)=> {
            updateCurrentActive(index)
        }}
        />

       
        <box spacing={10}>
            <image class={"list-button-icon"} iconName={item.icon} pixelSize={24} />
            <label class={"list-button-text"} label={item.label} ellipsize={Pango.EllipsizeMode.END}></label>
         </box>
    </button>

    )
                        
   
}

export default function Menu({state,window,backstate}:{state:null|string,window:Astal.Window,backstate:Accessor<string|null>}) {
    const [menus,updateMenus] =createState<Menu[]>([])
    const [ready,updateReady] = createState(false);
    let box:Gtk.Box;
    let visibleWatcher:number
    
    const getMenu = async() => {
        const menus = await getMenus(); 
        updateMenus(menus);
    }
    const currentMenu = createComputed(()=> {
        return menus().find(m=>m.slug == state);
    })


    

    const titleLabel = createComputed(()=> {
        const c = menus().find(m=>m.slug == state);
        if(!c) return ""
        return c.title;
    })
    const visible = createComputed(()=> {
        if (state !==null && currentMenu()) {
            return true
        } else {
            return false; 
        }
        
    })
    const buttonList = createComputed(()=> {
        
        if(!currentMenu()) return [];
        if(currentMenu() == undefined) return []
        if(!currentMenu()?.items) return [];
        if(currentMenu()?.items == undefined) return [];
        return currentMenu()?.items

    })
    
    let fakeInput:Gtk.Entry;


    return <box 
    visible={visible}
    vexpand
    $={async self=> {
        getMenu(); 
        box = self; 
        visibleWatcher = window.connect("notify::visible",()=> {

            if(window.get_visible()) {      
                fakeInput.grab_focus(); 
            } else {
                updateCurrentActive(0)
            }
        })
        onCleanup(()=> {
            window.disconnect(visibleWatcher);

        })
    }}
    class={"popover-styling"}
    overflow={Gtk.Overflow.HIDDEN}
    >   
    
        
        <Adw.Clamp maximumSize={400}>   
            <box overflow={Gtk.Overflow.HIDDEN} orientation={Gtk.Orientation.VERTICAL} class={"launcher-menu"}>
                <entry 
                $={self => {
                    fakeInput=self; 
                    setTimeout(()=> {
                        fakeInput.grab_focus(); 
                    },100  )
                }

                }
                onActivate={()=> {
                    const bl = buttonList(); 
                    const i = currentActive();
                    if(bl) {
                        window.hide()
                        execAsync(bl[i].exec)
                    }
                    
                     
                    
               
                   
                }}
                class="fake-entry">
                <Gtk.EventControllerKey
                onKeyPressed={(_,key)=>{
                    
                    if(key==Gdk.KEY_Escape) {
                        if(backstate && backstate()) {
                            execAsync(`ags request launcherstate ${backstate()} -i my-shell`)
                            return
                        }
                        window.hide();
                        return true;  
                    }
                    if(key == Gdk.KEY_Up) {
                        const bl = buttonList();
                        if(bl) {
                            if(currentActive() === 0) {
                                updateCurrentActive(bl.length - 1);
                                return true
                            }
                            updateCurrentActive(currentActive() - 1);
                            return true

                        }
                      
                     
                        return true;
                    }
                    if(key==Gdk.KEY_Down) {
                        const bl = buttonList(); 
                        if(bl && currentActive() === bl.length -1) {
                            updateCurrentActive(0)
                            return true; 
                        }   
                        if(bl ) {
                            updateCurrentActive(currentActive() + 1);
                            return true;
                        }
                    }
                    return true; 
                    
                }}
                
                />
                </entry>
                <Header label={titleLabel} backstate={backstate}/>
                <scrolledwindow propagateNaturalHeight={true} maxContentHeight={800}>
      
                <box class={"menu-list menu-container"} vexpand>
                <With value={buttonList}>
                {list => {
                    const inside = !list?<box/> : list.map((m,i)=><ListItem item={m}  index={i}window={window}/>)
                    return <box hexpand={true} orientation={Gtk.Orientation.VERTICAL}>
                       
                       {inside}
                    </box>
                }}
                </With>

            </box>
            </scrolledwindow>
            </box>
        </Adw.Clamp>     
        
        

        
    </box>
}

