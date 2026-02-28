import app from "ags/gtk4/app"
import scss from "./style.scss"
import Bar from "./Bar"
import Calendar from "./widget/Calendar"
import OSDWindow from "./osd/Window"
import QuickSettingsWindow from "./widget/QuickSettings/Window" 
import NotificationsWindow from "./notifications/Window"
app.start({
  css:scss,
  icons: `/home/admin/.config/ags/icons`,
  instanceName: "my-shell",
  main() {
    QuickSettingsWindow();
     Calendar()
    OSDWindow();
    NotificationsWindow(); 
    app.get_monitors().map(Bar)
   
  },
})
  