//@ts-ignore
import AstalTray from "gi://AstalTray"
import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app"
import { Accessor, createBinding, createComputed, createState, Setter,  } from "gnim";
import Graphene from "gi://Graphene?version=1.0";
import { Astal } from "ags/gtk4";
import TrayWindow from "./Tray/TrayWindow";
import { For } from "gnim";
import Gio from "gi://Gio?version=2.0";
import Adw from "gi://Adw?version=1";

const TrayItem = ({item}:{item:AstalTray.TrayItem})=> {

    let menu : Gtk.MenuButton;
    const icon : Accessor<Gio.Icon> = createBinding(item,"gicon");
    const menuModel :Accessor<Gio.MenuModel> = createBinding(item,"menuModel");
    let ag_handler:number; 


   
                
    const menuButton = <menubutton
    direction={Gtk.ArrowType.LEFT}
    valign={Gtk.Align.END}
    menuModel={menuModel}
    onDestroy={()=> {
        item.disconnect(ag_handler);

    }}
    $={(self)=>{
        menu = self; 
        
        
        ag_handler = item.connect("notify::action-group", () => {
            self.insert_action_group("dbusmenu", item.get_action_group())
        })
        self.insert_action_group("dbusmenu",item.get_action_group())
        

    }}
    >
        <image class={"tray-icon"} gicon={icon} pixelSize={14} />
    </menubutton> as Gtk.MenuButton; 
    


    return <box class={"tray-button"}>
        {menuButton}
    </box>
}

export default function Tray() {
    let topPopover: Gtk.Popover;
    let vis_handler: number;
    const [popoverOpen,updatePopoverOpen] = createState(false);
    const tray = AstalTray.get_default(); 
    const items :Accessor<AstalTray.TrayItem[]>= createBinding(tray, "items").as((items) =>
      items.filter((item:any) => item.id !== null),
    );




     const iconName = createComputed(()=> {
        const dir = popoverOpen()?"down":"up";
        return `banana-chevron-${dir}-symbolic`;
    })
    let rowCount = 0;
    let currentRow = 0;
    const addItem = (i:AstalTray.TrayItem) => {

    }
    const layoutArray: Accessor<AstalTray.TrayItem[][]> = createComputed(()=> {
        const layout :number[][] = [];
        const it = items(); 
        const rows = Math.floor(it.length/4);
        for(let i = 0; i < rows;i++) {
            layout.push([]);
        }
        if(it.length%4) {
            layout.push([]);
        }
        let rowCount=0;
        let currentRow=0;
        const addItem = (i:AstalTray.TrayItem,index:number) => {
            layout[currentRow].push(i);
            rowCount++
            if(rowCount===4) {
                currentRow++;
                rowCount=0;
            }
        }   
        it.forEach(addItem)

        return layout;
    })



     return <box>
        <menubutton class={"container-spacer button tray-menu"} direction={Gtk.ArrowType.UP} halign={Gtk.Align.CENTER}>
            <image iconName={iconName} pixelSize={20}/>
    
            <popover class={"popover-styles"}
            
            onDestroy={()=> {
                topPopover.disconnect(vis_handler);
            }}
            $={self=>{
                topPopover = self; 
                vis_handler = topPopover.connect("notify::visible",()=> {
                    if(topPopover.get_visible()) {
                        updatePopoverOpen(true);
                    } else {
                        updatePopoverOpen(false);
                    }
                })
                self.set_offset(0,6);
            }}
            >
                <box orientation={Gtk.Orientation.VERTICAL} class={'popover-styles tray-top-popover'}>
                    <For each={layoutArray}>{
                        (r)=> {
                          return <box class={"tray-row"} orientation={Gtk.Orientation.HORIZONTAL}>
                            {r.map(i=><TrayItem item={i} />)}
                            </box>
                        }
                        }</For>
                 
                </box>

            </popover>
          
        </menubutton>
     </box>
     
   /* const trayPopUp= app.get_window("TRAY_WINDOW") as Astal.Window;
    if(!trayPopUp) return <label/>;
   


    const popupOpen = createBinding(trayPopUp,"visible");

    const rotate = createComputed(()=> {
        const iconName = "banana-chevron-up-symbolic"
        return (popupOpen())? iconName.replace("up","down"):iconName
    })
    const popupState = createComputed(()=>popupOpen()?false:true)

    const positionWindow = (box:Gtk.Widget,window: Astal.Window,anchor:"left"|"right"|"center") => {
        const width = box.get_size(Gtk.Orientation.HORIZONTAL)
        const {BOTTOM,RIGHT,LEFT} = Astal.WindowAnchor
        let anchorPos = BOTTOM|LEFT;
        const root = box.get_root()
        if(!root) return ; 
        console.log(root.get_size(Gtk.Orientation.HORIZONTAL))
        const [_,{x,y}] = root.compute_point(box,new Graphene.Point({x:0,y:0}))
        const leftD = Math.abs(x);
        let margin:number; 
        switch (anchor) {
            case "left": {
                margin=leftD;
                anchorPos=BOTTOM|LEFT
                window.set_anchor(anchorPos);
                window.set_margin_left(leftD);
                return ; 
            }
        }

       


    }

*/

   


  /*  return <menubutton
    
            $={(self) => {
            box = self
            }}
    class={"button container-spacer"}>
        <image iconName={rotate} />

      <TrayWindow/>
    </menubutton>*/
}