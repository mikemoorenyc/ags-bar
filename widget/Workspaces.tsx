import { createBinding, createEffect ,createComputed, createState} from "gnim"
import { For,With } from "gnim";
// @ts-ignore
import AstalHyprland from "gi://AstalHyprland?version=0.1";

import { Accessor } from "gnim";
import Pango from "gi://Pango"

// @ts-ignore
import AstalApps from "gi://AstalApps?version=0.1";

let appManager: AstalApps.Apps | null = null;

const hypr = AstalHyprland.get_default()

const iconFinder = (client:AstalHyprland.Client) :string=> {
    if (!appManager) {
      appManager = new AstalApps.Apps();
   }
  
   const nameSplit = client.get_class().split(".")
   const app = appManager.fuzzy_query(nameSplit[nameSplit.length-1]);
   if(!app.length) {
    return "application-x-generic"
   }
   return app[0].get_icon_name(); 
}

// / <label label={focused.toString()}/>
function ClientItem({client}:{client:AstalHyprland.Client}) {
    const title = createBinding(client,"title");
    const focusedClient = createBinding(hypr,"focused-client");
    const toolTip = createComputed(()=>title().trim())
    
    const iconName = createComputed(()=>iconFinder(client));
    const focusedAddress = createComputed(()=> (focusedClient()&&focusedClient()?.address)?focusedClient().address.toString():"")


    const btnClass = createComputed(()=> {
        const classes = ["client-button"];
        const isFocused = focusedAddress() == client.get_address().toString();
        if(isFocused) {
            return [...classes,...["focused"]]
        }
        return classes;
    })
    return <button cssClasses={btnClass} tooltipText={toolTip}  onClicked={()=>{client.focus()}}>
        <box>
            <image iconName={iconName} pixelSize={20}/>

        </box>
    </button>
}
const WorkspaceItem = function({item,focused}:{item:any,focused:any}) {

   const clients = createBinding(item,"clients");
   const showClients = createComputed(()=>clients().length > 0);
   
   const btnClasses = createComputed(()=> {
    const classes=["button","sm","ws"];
    const isVisible = clients().length > 0?"not-empty":"empty";
    classes.push(isVisible);
    const wsId = item.id.toString();
    const focusedClass = wsId === focused.toString() ? "focused" : "not-focused";
    classes.push(focusedClass);

    return classes
   })
    
    
    return <box cssClasses={btnClasses}>
        
        <box><button class={"workspace-button"} label={item.id.toString()} onClicked={()=>{item.focus()}} />
        <box visible={showClients} css={"padding-right:6px;"}>
            <For each={clients}>{
            (client)=><ClientItem client={client} />    
            }</For>
        </box>
        </box>
    </box>
       

   
    
}
//

export default function () {
    
    const ws = createBinding(hypr,"workspaces");
    const focusedWorkspace = createBinding(hypr,"focused-workspace")
    
    const flip = createComputed(()=>ws().sort((a:any, b:any) => a.id - b.id))
    const focusId = createComputed(()=>focusedWorkspace().id)


    return <box class={"container workspace-container"}>
        <With value={focusId}>{(focusId)=><box>
            <For each={flip}>{(item)=>(
                <WorkspaceItem focused={focusId} item={item} />
            )}</For>
            
            </box>}

        </With>
    </box>
}
/*
<box class={"container"}>

<For each={flip}>
      {(item, index: Accessor<number>) => {
        
       return<With value={focusId}>{(value)=><WorkspaceItem focused={focusId()} item={item} />}</With> 
      }}
    </For>
    </box>
    */

//<WorkspaceItem focused={focusId()} item={item} />


/*        <label  
        maxWidthChars={16}
        ellipsize={Pango.EllipsizeMode.END}
        label={toolTip} class="client-label"/>*/