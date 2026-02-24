import { Node, onCleanup } from "ags"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import app from "ags/gtk4/app"
import Graphene from "gi://Graphene?version=1.0"


 function Calendar({children}:{children:any}) {
    const {BOTTOM,RIGHT,LEFT} = Astal.WindowAnchor
  let win: Astal.Window
  onCleanup(() => {
    win.destroy()
  })

  return (
    <window
      $={(self) => {
        win = self
      
      }}

      visible={false}
      name={"CALENDAR_WINDOW"}
      namespace={"CALENDAR_WINDOW"}
      layer={Astal.Layer.TOP}
      application={app}
      anchor={BOTTOM|RIGHT}
      monitor={0}
      marginBottom={8}
      marginRight={8}
      keymode={Astal.Keymode.EXCLUSIVE}
      
    >
      <Gtk.EventControllerKey
        onKeyPressed={({ widget: win }, key: number) => {
          if (key === Gdk.KEY_Escape) {
            win.hide()
            return true
          }
        }}
      />
  <Gtk.GestureClick
        onReleased={({ widget: win }, _, x, y) => {
            console.log("cleck")
           const [, rect] = children?.compute_bounds(win)
          const position = new Graphene.Point({ x, y })

          if (!rect.contains_point(position)) {
            win.visible = false
            return true
          }
          return false 
        }}
      />

      {children}
    </window>
  )
}
export default function () {
    return <Calendar >
<Gtk.Calendar cssName={"calendar"} class={"popover-styles-base"}/>
        </Calendar>
}