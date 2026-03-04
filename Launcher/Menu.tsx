import { readFile, readFileAsync } from "ags/file"
import { Astal, Gdk, Gtk } from "ags/gtk4";
import Adw from "gi://Adw?version=1";
import { Accessor, createComputed, createState, onCleanup, With } from "gnim";
import Pango from "gi://Pango?version=1.0";
import { execAsync} from "ags/process";
import KeyController from "./KeyController";

type MenuItem = {
    label:string, 
    icon:string, 
    exec:string
}

type Menu = {
    title:string,
    slug:string, 
    items: MenuItem[]
}
export const [currentActive,updateCurrentActive] = createState(0)



type ListItemProps = JSX.IntrinsicElements["button"] & {
    item:MenuItem,
    index:number,

}

const ListItem = ({item,index}:ListItemProps) => {
    const classes = createComputed(()=> {
        return currentActive() === index ? "list-button active":"list-button"
    })
   
    return (
    <button 
    $={(self)=> {

    }}
    onClicked={()=> {
      
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

export default function Menu({state,window}:{state:null|string,window:Astal.Window}) {
    const [menus,updateMenus] =createState<Menu[]>([])
    const [ready,updateReady] = createState(false);
    let box:Gtk.Box;
    let visibleWatcher:number
    
    const getMenu = async() => {
        const raw = (await readFileAsync("/home/admin/.config/ags/launcher-menus.txt")).split("\n\n").filter(n=>n.trim().length > 1);
        const menus:Menu[]=[]
    
        raw.forEach(r=> {
            const broken = r.split("\n");
            if(broken.length < 3) return ; 
            if(broken[0].startsWith("slug") == false||broken[1].startsWith("title")==false) {
                return ; 
            }
            let slug = broken[0].replace("slug:","").trim();
            let title = broken[1].replace("title:","").trim(); 
            broken.shift();
            broken.shift();
            let items = broken.map(i => {
                let b = i.split(",");
                if(b.length !== 3) return {
                    label:"",
                    exec:"",
                    icon:""
                };
                return {
                    label: b[0].trim(),
                    exec: b[1].trim(),
                    icon: b[2].trim()
                }
            })
            menus.push({
                items,
                slug,
                title
            })
        })
        updateMenus(menus);

      
    }
    const currentMenu = createComputed(()=> {
        return menus().find(m=>m.slug == state);
    })

    const currentMenuLength = createComputed(()=> {
        if(!currentMenu()) return -1; 
        if(currentMenu() && currentMenu()?.items) return currentMenu()?.items.length;
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
    


    return <box 
    visible={visible}
    vexpand
    $={async self=> {
        getMenu(); 
        box = self; 
        self.set_focusable(true);
        visibleWatcher = box.connect("notify::visible",()=> {
            if(box.get_visible()) {
               
                box.grab_focus(); 
            }
        })
        updateReady(true);
        onCleanup(()=> {
            box.disconnect(visibleWatcher);

        })



    }}
    >   
        <KeyController 
        upFunction={()=> {
            if(!ready()||!visible()) return true; 
            if(currentActive() <1) return true; 
            updateCurrentActive(currentActive()-1);
            return true; 
        }}
        downFunction={()=> {
            if(!ready()||!visible()) return true;
            if(!currentMenuLength()) return true; 
            if(currentActive() == currentMenuLength()! - 1) return true
            updateCurrentActive(currentActive()+1)  
            return true 
        }}
        escapeFunction={()=> {
            if(!ready()||!visible()) return true;
            window.hide();
            return true; 
        }}
        returnFunction={()=> {
            if(!ready()||!visible()) return true;
            if(!currentMenu()|| !currentMenu()?.items) return true; 
             
            execAsync(currentMenu()?.items[currentActive()].exec!)
            return true;
        }}
        
        />
        
        <Adw.Clamp maximumSize={600}>   
            <box overflow={Gtk.Overflow.HIDDEN} orientation={Gtk.Orientation.VERTICAL} class={"launcher-menu"}>
                <box class={"header"}>
                    <label label={titleLabel} class={"header-text"}/>
                </box>
                <scrolledwindow propagateNaturalHeight={true} maxContentHeight={800}>
      
                <box class={"menu-list"} vexpand>
                <With value={buttonList}>
                {list => {
                    const inside = !list?<box/> : list.map((m,i)=><ListItem item={m}  index={i}/>)
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


/*
 <Gtk.EventControllerKey 
        
        onKeyReleased={(_,key)=> {
            if(!ready()||!visible()) return true; 
            if(key == Gdk.KEY_Down) {
                if(!currentMenuLength()) return true; 
                if(currentActive() == currentMenuLength()! - 1) return true
                updateCurrentActive(currentActive()+1)
            }
         
            if(key == Gdk.KEY_Escape) {
                window.hide();
              
                return true; 
            }
            if(key==Gdk.KEY_Up) {
                if(currentActive() <1) return true; 
                updateCurrentActive(currentActive()-1);
            }
            
            if(key == Gdk.KEY_Return) {
    
                if(!currentMenu()|| !currentMenu()?.items) return true; 
             
                execAsync(currentMenu()?.items[currentActive()].exec!)
            }

            return true
        }}
        
        />
*/