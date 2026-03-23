import { readFileAsync, writeFileAsync } from "ags/file";
import { Astal } from "ags/gtk4";
import { Accessor, createComputed, For, With } from "gnim";
import { createState } from "gnim";
import { listFilenamesInDir } from "../util/files";
import Adw from "gi://Adw?version=1";
import Gtk from "gi://Gtk?version=4.0";
import Header from "./Header";
import Pango from "gi://Pango?version=1.0";
import KeyController from "./KeyController";
import { execAsync } from "ags/process";
execAsync

type TListItemProps = {
    filename:string, 
    index:Accessor<number>,
    activeSetter:()=>void,
    selector:()=>void
}
const [currentActive,updateCurrentActive] = createState(0)

const ListItem = ({filename,index,selector,activeSetter}:TListItemProps) => {
    const classes = createComputed(()=> {
            return currentActive() === index() ? "list-button active big-raised":"list-button"
    })
    const name = createComputed(()=> {
        let split = filename.split("/");
        return split[split.length-1].split(".")[0];
    })
    return <button
    class={classes}
    hexpand
    onClicked={()=>{selector()}}
    ><Gtk.EventControllerMotion
            onEnter={(s,d,e)=> {
                activeSetter()
            }}
            />
        <box spacing={10} hexpand>
              
            <label class={"list-button-text"} label={name} ellipsize={Pango.EllipsizeMode.END}></label>
            </box>

    </button>
}

export default function WallPaper({window,backstate}:{window:Astal.Window,backstate?:Accessor<string|null>}) {
    let pic:Gtk.Picture;
    const [savedWallpaper,updateSavedWallpaper] = createState<null|string>(null)
    const [selectedWallpaper,updateSelectedWallpaper] = createState<string|null>(null)
    const [wallpaperOptions,updateWallpaperOptions] = createState<string[]>([])

    const closeRequest = () => {
        if(backstate && backstate()) {
        execAsync(`ags request launcherstate ${backstate()} -i my-shell`)
        
            return
        }
        updateCurrentActive(0)
        window.hide();
        
        return true;  
    }
    
    let fakeInput:Gtk.Entry

    const s = createComputed(()=>{
        if(selectedWallpaper()==null) {
            return "asd"
        } else {
            return selectedWallpaper()!
        }
    })
    
    

    const setup = async () => {
        const savedW = await readFileAsync('/home/admin/.config/ags/backgroundPath');
        if(savedW) {
            updateSavedWallpaper(savedW);
        }
        console.log(savedW);
        const options = listFilenamesInDir("/home/admin/.config/ags/backgrounds").map(o => "/home/admin/.config/ags/backgrounds/"+o);
        
        updateWallpaperOptions(options)
        console.log(options);
        
        setTimeout(()=> {
            let i:string
            if(options.find(o=>o == savedW)) {
            i = options.find(o=>o==savedW)!
            updateCurrentActive(options.findIndex(o=>o==savedW))
            updateSelectedWallpaper(options.find(o=>o == savedW)!)
        } else {
            console.log("dasd")
            pic.set_filename(options[0])
            updateSelectedWallpaper(options[0]);
            i = options[0]
        }

        pic = Gtk.Picture.new_for_filename(i)
            pic.contentFit = Gtk.ContentFit.COVER
            pic.widthRequest=800
          
            pic.set_css_classes(["wallpaper-thumb"])
        
        },100)
    }

    return <box
    class={"popover-styling"}
    overflow={Gtk.Overflow.HIDDEN}
    $={self => {
        setup(); 
    }}
    orientation={Gtk.Orientation.VERTICAL}
    >
        <Header label={"Select wallpaper"} backstate={backstate}/>

        <box css={"min-width:800px"} overflow={Gtk.Overflow.HIDDEN} class={"menu-container"} widthRequest={800}>
          
            <box hexpand overflow={Gtk.Overflow.HIDDEN} orientation={Gtk.Orientation.VERTICAL} class={""}>
                <entry 
                    $={self => {
                        fakeInput=self; 
                        setTimeout(()=> {
                            fakeInput.grab_focus(); 
                        },100  )
                         setTimeout(()=> {
                            fakeInput.grab_focus(); 
                        },500  )
                    }
                
                    }
                    onActivate={async ()=> {   
                        const bl = wallpaperOptions(); 
                        const ca = currentActive();
                        closeRequest(); 
                        await writeFileAsync('/home/admin/.config/ags/backgroundPath', bl[ca])
                        await execAsync(`pkill -x swaybg`) 
                        await execAsync(`swaybg -i "${bl[ca]}" -m fill`)
        

                    }}
            class="fake-entry">
                <KeyController 
                    escapeFunction={()=> {
                        console.log("dfas")
                        closeRequest(); 
                        return true;  
                    }}
                    upFunction={()=> {
                        const bl = wallpaperOptions()
                        let indexNum:number
                        if(bl) {
                            if(currentActive() === 0) {
                                indexNum = bl.length - 1; 
              
                            } else {
                                indexNum = currentActive() - 1;
                            }
                            updateCurrentActive(indexNum);
                            updateSelectedWallpaper(bl[indexNum]);
                            pic.set_filename(bl[indexNum]);
                            return true

                        }
                        return true;
                    }}
                    downFunction={()=> {
                        const bl = wallpaperOptions(); 
                        let indexNum:number; 
                        if(bl && currentActive() === bl.length -1) {
                            indexNum=0;
                           
                        }   
                       else {
                            indexNum = currentActive() + 1
                        
                        }
                        updateCurrentActive(indexNum);
                        updateSelectedWallpaper(bl[indexNum])
                        pic.set_filename(bl[indexNum]);
                        return true; 
                    }}
                />

            </entry>
            <box class={"menu-list menu-container"} vexpand orientation={Gtk.Orientation.VERTICAL}>
            <For each={wallpaperOptions} id={o=>o}>
            {(o,i)=><ListItem filename={o} index={i} activeSetter={()=> {
                const bl = wallpaperOptions()
                updateCurrentActive(i());
                updateSelectedWallpaper(o)
                pic.set_filename(bl[i()])
            }}
            selector={async ()=> {
                const bl = wallpaperOptions(); 
                closeRequest(); 
                await writeFileAsync('/home/admin/.config/ags/backgroundPath', bl[i()])
                await execAsync(`pkill -x swaybg`) 
                await execAsync(`swaybg -i "${bl[i()]}" -m fill`)
        
                

            }}
            />}
            </For>
            

            </box>
                
            </box>

 
        <Adw.Clamp maximumSize={800}>
            <box css={"min-width:800px;"}$={self=> {
            setTimeout(()=> {
                self.append(pic);
            },500)
        }}>

        </box>
        </Adw.Clamp>
        <box>


        </box>

    
        
        </box>
    </box>
}