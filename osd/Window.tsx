import OSD, {visible} from "./osd"
import app from "ags/gtk4/app"
import { Astal } from "ags/gtk4"

export default function () {
    const name = "OSD_WINDOW"
    const {BOTTOM,LEFT,RIGHT} = Astal.WindowAnchor

    return <window
    visible={visible}
    name={name}
    namespace={name}
    layer={Astal.Layer.OVERLAY}
    application={app}
    anchor={BOTTOM|LEFT|RIGHT}
    marginBottom={48}
    keymode={Astal.Keymode.NONE}
    >
        <OSD />
    </window>
}