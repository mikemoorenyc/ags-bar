import app from "ags/gtk4/app"
import scss from "./style.scss"
import Bar from "./Bar"
import Calendar from "./widget/Calendar"
import TrayWindow from "./widget/Tray/TrayWindow"
app.start({
  css:scss,
  icons: `/home/admin/.config/ags/icons`,
  main() {
   TrayWindow()
     Calendar()
    app.get_monitors().map(Bar)
   
  },
})
