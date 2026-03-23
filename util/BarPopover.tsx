import { Gtk } from "ags/gtk4";
import { createComputed, createState, onCleanup } from "gnim";

type TPopoverProps = JSX.IntrinsicElements["menubutton"] &{
    classes?:string;
    buttonChildren:any
    children:any,
    offset?:[number,number],
    direction?:Gtk.ArrowType,
    halign?:Gtk.Align,
    updateVisible?:(vis:boolean)=>void
}

export default function BarPopover(props:TPopoverProps) {
    const {buttonChildren,direction,halign,classes,offset,children,updateVisible} = props
    let popover:Gtk.Popover
    let visible_check:number;
    const [isOpen,updateIsOpen]=createState(false)
    const classString = createComputed<string>(()=> {
        let classString = classes || ""
        classString += " bar-popover-button"
        if(isOpen()) {
            classString+= " active"
        }

        return classString
    })

    return <menubutton class={classString} direction={direction||undefined} halign={halign||undefined}>
        {buttonChildren}
        <popover
        class="bar-popover"
        $={self => {
            popover = self; 
            if(offset) {
                popover.set_offset(offset[0],offset[1]); 
            }
            visible_check = popover.connect("notify::visible",()=> {
                updateIsOpen(popover.get_visible())
                if(updateVisible) {
                    updateVisible(popover.get_visible())
                }
            })
            onCleanup(()=> {
                popover.disconnect(visible_check);
            })

        }}
        
        >
      
            {children}
        </popover>

    </menubutton>
}