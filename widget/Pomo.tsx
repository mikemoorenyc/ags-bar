import { Accessor, createState ,createComputed} from "gnim"
import { execAsync } from "ags/process";
import { onCleanup } from "gnim"
import app from "ags/gtk4/app"

import {  Gtk } from "ags/gtk4"

export default function () {
    const [timer,updateTimer] = createState<null|any>(null)
    const [state,updateState] = createState<string>("stopped");
    const [count,updateCount] = createState<number>(0);
    let box :Gtk.Box;
    const totalSeconds = 2100;
    let stopCheck:number
    
    const startTimer = (state:string) => {
        console.log(state);
        updateState("running");
        if(state === "stopped") {
            execAsync('notify-send "Get to work"')
          
            console.log("d");
            updateCount(totalSeconds);
            
        }
        updateTimer(()=> {
            return setInterval(()=> {
                updateCount((prev)=> {
                    if(prev < 1) {
                        execAsync('notify-send "Get to work" ')
                        execAsync("paplay /usr/share/sounds/freedesktop/stereo/complete.oga")
                        return totalSeconds;
                    };
                    if(prev === 6*60) {
                        execAsync('notify-send "Take a break" ')
                        execAsync("paplay /usr/share/sounds/freedesktop/stereo/complete.oga")
                    }
                    return prev -1
                })

            },1000 )
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
    const pauseButtons = createComputed(()=>state().toString() == "running"?"banana-playback-play-symbolic":"banana-playback-pause-symbolic")

    const controlsVisible = createComputed(()=> state() !== "stopped")
    const containerClasses = createComputed(()=> {
        const classes = ["container","pomo"];
        if(state() !=="stopped") {
            classes.push("button");
            classes.push("active");
        }
        return [...classes,state()]
    })
    const toolTipText = createComputed(()=> {
        if(state()=="stopped") return "Start Pomodoro";
        const time:number = count();
        const remaining:number = totalSeconds - (totalSeconds - time);
        const minutes = Math.floor(remaining / 60);
        const seconds = remaining % 60;

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    })

    const buttonClasses = createComputed(()=> {
        let classes = ["banana","button"];
        if(state() !== "stopped") {
            classes=["banana"];
        }
        
        const time = parseInt(count().toString());
        const stateString = state().toString(); 
        if(stateString === "stopped") return [...classes,...["stopped"]];
        if(time > 25 * 60) return [...classes,...["start"]]
        if(time > 15 * 60) return [...classes,...["middle"]]
        if(time > 5 * 60 ) return [...classes,...["end"]]
        
        return [...classes,...["break"]] 
    })
    const bananaLabel = createComputed(()=> {
        return (count() <= 5   && state() !== "stopped" ) ? "banana-coffee-symbolic":"banana-tomato-symbolic"
        
       
    })

    return (
    <box 
    $={(self) => {
        box = self
        stopCheck = app.connect("request",(app, [cmd, arg, ...rest], response)=> {
            if(cmd !== "pomo") return ;

            
            
            
        })
        onCleanup(()=> {
            app.disconnect(stopCheck)
        })
      
      }}
    cssClasses={containerClasses}
    
    tooltipText={toolTipText}>
        <button 
            
            hasTooltip={true}
            cssClasses={buttonClasses} 
            onClicked={()=>{
        
                if(state().toString() !== "stopped") {
                    console.log("running sowwy")
                    return ;
                }
                startTimer(stateString())
            }}
        
        > <image iconName={bananaLabel} pixelSize={22}/></button>
        <box visible={controlsVisible}>
            <button class={"control"} onClicked={()=> {
                if(state()== "running") {

                    stopTimer(true)
                } else {
                    startTimer(state()); 
                }
            }}><image iconName={pauseButtons} pixelSize={15} /></button>
            <button class={"control"}  tooltipText={"Stop Pomodoro"} onClicked={()=>{stopTimer()}}>
                <image iconName={"banana-playback-stop-symbolic"} pixelSize={15} />
            </button>
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

