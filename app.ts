import app from "ags/gtk4/app"
import scss from "./style.scss"
import Bar from "./Bar"
import Calendar from "./widget/Calendar"
import OSDWindow from "./osd/Window"
import QuickSettingsWindow from "./widget/QuickSettings/Window" 
import NotificationsWindow from "./notifications/Window"
import LauncherWindow from "./Launcher/Window"
import { launcherSignal } from "./Launcher/Window"
app.start({
  css:scss,
  icons: `/home/admin/.config/ags/icons`,
  instanceName: "my-shell",
  requestHandler(argv: string[], response: (response: string) => void) {
    const [cmd, arg, ...rest] = argv
 
    if (cmd == "launcherstate") {
     launcherSignal(arg);
      return response(arg)
    }
    
  },
  main() {
    QuickSettingsWindow();
     Calendar()
    OSDWindow();
    NotificationsWindow(); 
    LauncherWindow();
    app.get_monitors().map(Bar)
   
  },
})
  