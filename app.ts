import app from "ags/gtk4/app"
import scss from "./style.scss"
import Bar from "./Bar"
import Calendar from "./widget/Calendar"
app.start({
  css:scss,
  main() {
     Calendar()
    app.get_monitors().map(Bar)
   
  },
})
