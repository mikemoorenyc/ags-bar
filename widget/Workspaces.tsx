import { createBinding, createEffect ,createComputed, createState} from "gnim"
import { For,With } from "gnim";
// @ts-ignore
import AstalHyprland from "gi://AstalHyprland?version=0.1";

import { Accessor } from "gnim";

// / <label label={focused.toString()}/>
const WorkspaceItem = function({item,focused}:{item:any,focused:any}) {
    const [buttonState,updateButtonState] = createState(["button","sm"])
    /*
    const clients = createBinding(item,"clients");

    const num = createComputed(()=>clients().length)
    const isVisible = createComputed(()=>clients().length > 0?"not-empty":"empty");
    const focusedClass = createComputed(()=> {
        const wsId = item.id.toString();
        return wsId === focused.toString() ? "focused":"not-focused"
    })
    */
   const clients = createBinding(item,"clients");
   
   const btnClasses = createComputed(()=> {
    const classes=["button","sm","ws"];
    const isVisible = clients().length > 0?"not-empty":"empty";
    classes.push(isVisible);
    const wsId = item.id.toString();
    const focusedClass = wsId === focused.toString() ? "focused" : "not-focused";
    classes.push(focusedClass);

    return classes
   })
    
    
    return <button cssClasses={btnClasses()} label={item.id.toString()} onClicked={()=>{item.focus()}} />
       

   
    
}

export default function () {
    const hypr = AstalHyprland.get_default()
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