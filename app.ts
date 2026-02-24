import app from "ags/gtk4/app"
import scss from "./style.scss"
import Bar from "./Bar"
import Calendar from "./widget/Calendar"
import OSDWindow from "./osd/Window"
import QuickSettingsWindow from "./widget/QuickSettings/Window" 
app.start({
  css:scss,
  icons: `/home/admin/.config/ags/icons`,
  main() {
    QuickSettingsWindow();
     Calendar()
    OSDWindow();
    app.get_monitors().map(Bar)
   
  },
})
