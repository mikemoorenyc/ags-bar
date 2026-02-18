import BarPopUp from "../../util/BarPopUp"
//@ts-ignore
import AstalTray from "gi://AstalTray"
import { createBinding ,createComputed, createState} from "gnim";
import Gtk from "gi://Gtk?version=4.0";
import { For } from "gnim";
import app from "ags/gtk4/app";
import Graphene from "gi://Graphene?version=1.0";
import { Astal } from "ags/gtk4";
import Gtk40 from "gi://Gtk";


function TrayInner() {
    const tray = AstalTray.get_default(); 
        
       
     const items = createBinding(tray, "items").as((items) =>
      items.filter((item:any) => item.id !== null),
    );

    

    let box:Gtk.Box;
    let win:Gtk.Root|null

    return <box 
 
 orientation={Gtk.Orientation.VERTICAL} spacing={5} class={"popover-styles tray-popup"}>
   

            <For id={(it:AstalTray.TrayItem)=>it.id} each={items}>{
            (item:AstalTray.TrayItem) =>{
               if(!item.id == null) {
                  return <box/>
               }
               const twin = app.get_window("TRAY_WINDOW") as Astal.Window
               
               let ag_handler: number;
      
               let menuDom : Gtk.MenuButton
               let popover: Gtk.Popover|null;
               let visHandler:number; 
     
               const menuButton = <menubutton
               class={"popup-button"}
               menuModel={createBinding(item,"menuModel")}
               onDestroy={()=>{
                  item.disconnect(ag_handler)
                  popover?.disconnect(visHandler)
              
               }}
               $={self => {
                  menuDom = self; 
                  popover = self.get_popover(); 
                  ag_handler = item.connect("notify::action-group", () => {
                     self.insert_action_group("dbusmenu", item.get_action_group())
                  })
                  self.insert_action_group("dbusmenu",item.get_action_group())
                  
                  if(popover) {
                     visHandler = popover?.connect("notify::visible",()=> {
                        if(popover?.get_visible()) {
                           twin.set_keymode(Astal.Keymode.NONE)
                        } else {
                           twin.set_keymode(Astal.Keymode.EXCLUSIVE)
                        }
                        
                     })
                  }
                  
             
               }}>
                  <image gicon={createBinding(item,"gicon")} pixelSize={14} />
               </menubutton> as Gtk.MenuButton
               
               return <box>
                  {menuButton}
           
               </box>
            }
            }</For>
        </box>


}

export default function TrayWindow() {
   const outsideClickCheck = (outside:boolean) => {
      console.log(outside);
    }
       

    return<BarPopUp openPosition="right" windowName="TRAY_WINDOW" outsideClickCheck={outsideClickCheck}>
 <TrayInner />
    </BarPopUp>
}