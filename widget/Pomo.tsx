import { Accessor, createState ,createComputed} from "gnim"
import { execAsync } from "ags/process";
import { onCleanup } from "gnim"
import { With } from "gnim";
import { Astal, Gdk, Gtk } from "ags/gtk4"
import Graphene from "gi://Graphene?version=1.0"
import app from "ags/gtk4/app"
export default function () {
    const [timer,updateTimer] = createState<null|any>(null)
    const [state,updateState] = createState<string>("stopped");
    const [count,updateCount] = createState<number>(0);
    let box :Gtk.Box;

    const startTimer = (state:string) => {
        console.log(state);
        updateState("running");
        if(state === "stopped") {
            execAsync('notify-send "Get to work"')
            console.log("d");
            updateCount(35);
            
        }
        updateTimer(()=> {
            return setInterval(()=> {
                updateCount((prev)=> {
                    if(prev < 1) {
                        execAsync('notify-send "Get to work" ')
                        return 35;
                    };
                    if(prev === 6) {
                        execAsync('notify-send "Take a break" ')
                    }
                    return prev -1
                })

            },1000 * 60)
        })
    }
    const stopTimer = (pause?:boolean) => {
        clearInterval(timer())
        updateTimer(null);
        if(!pause) {
            updateState("stopped");
            updateCount(0);
        } else {
            updateState("paused")
        }
        
    }
    onCleanup(()=> {
        clearInterval(timer())
        updateTimer(null);
    })
    const stateString = createComputed(()=>state().toString());
    const countString = createComputed(()=>count().toString())
    const pauseButtons = createComputed(()=>state().toString() == "running"?"󰐊":"󰏤")
    const countLabel = createComputed(()=>count().toString());
    const controlsVisible = createComputed(()=> state() !== "stopped")
    const containerClasses = createComputed(()=> {
        const classes = ["container","pomo"];
        return [...classes,state()]
    })
    const hasTooltip = createComputed(()=>state()=="stopped");

    const buttonClasses = createComputed(()=> {
        const classes = ["banana","button"];
        
        const time = parseInt(count().toString());
        const stateString = state().toString(); 
        if(stateString === "stopped") return [...classes,...["stopped"]];
        if(time > 25) return [...classes,...["start"]]
        if(time > 15) return [...classes,...["middle"]]
        if(time > 5 ) return [...classes,...["end"]]
        
        return [...classes,...["break"]] 
    })
    const bananaLabel = createComputed(()=> {
        
        if(count() <= 5   && state() !== "stopped" ) {
            return ""
        }
        return ""
    })

    return (
    <box 
    $={(self) => {
        box = self
      
      }}
    cssClasses={containerClasses}>
        <button 
            tooltipText={"Start Pomodoro"}
            hasTooltip={hasTooltip}
            cssClasses={buttonClasses} 
            label={bananaLabel} onClicked={()=>{
        
                if(state().toString() !== "stopped") {
                    console.log("running sowwy")
                    return ;
                }
                startTimer(stateString())
            }}
        />
        <box visible={controlsVisible}>
            <button class={"control"} label={pauseButtons} onClicked={()=> {
                if(state()== "running") {

                    stopTimer(true)
                } else {
                    startTimer(state()); 
                }
            }}/>
            <button class={"control"} label={"󰓛"} onClicked={()=>{stopTimer()}}></button>
        </box>
        

    </box>    


    )
    /*return <box cssClasses={}>

       <box><With value={rotClass}>{(value)=>{
            return <button cssClasses={["button","banana",rotClass()]} label={rotClass() !=="break"?"":"󰅶"} onClicked={()=>{
                if(state().toString() !== "stopped") {
                    console.log("running sowwy")
                    return ;
                }
                startTimer(stateString())
            }}/>
            
            
            
            
        }}</With></box> 

        <box><With value={stateString}>{
          (value)=> {
            return <box>
                {(<box visible={value!=="stopped"}>
            
            <button class={"button sm"} label={pauseButtons} onClicked={()=>{
                if(value== "running") {

                    stopTimer(true)
                } else {
                    startTimer(value); 
                }
            }}></button>
            <button class={"button sm"} label="󰓛" onClicked={()=>{stopTimer()}}></button>
        </box>)}
            </box>
          }
            
            }</With></box>
        
        
        
        
        

    </box>*/
}

