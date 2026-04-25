import app from "ags/gtk4/app"
import scss from "./style.scss"
import BarTest from "./BarTest"


export const overlayWindows = ["LAUNCHER_WINDOW","QUICKSETTINGS_WINDOW","CALENDAR_WINDOW","OSD_WINDOW"]
app.start({
  css:scss,
  icons: `/home/admin/.config/ags/icons`,
  instanceName: "test-shell",

  main() {
     

    app.get_monitors().map(BarTest)

   
  },
})
  