import { readFileAsync } from "ags/file";
import { MenuItem,Menu } from "./Menu";

export default async function () {
    const raw = (await readFileAsync("/home/admin/.config/ags/launcher-menus.txt")).split("\n\n").filter(n=>n.trim().length > 1);
            const menus:Menu[]=[]
        
            raw.forEach(r=> {
                const broken = r.split("\n");
                if(broken.length < 3) return ; 
                if(broken[0].startsWith("slug") == false||broken[1].startsWith("title")==false) {
                    return ; 
                }
                let slug = broken[0].replace("slug:","").trim();
                let title = broken[1].replace("title:","").trim(); 
                broken.shift();
                broken.shift();
                let items = broken.map(i => {
                    let b = i.split(",");
                    if(b.length !== 3) return {
                        label:"",
                        exec:"",
                        icon:""
                    };
                    return {
                        label: b[0].trim(),
                        exec: b[1].trim(),
                        icon: b[2].trim()
                    }
                })
                menus.push({
                    items,
                    slug,
                    title
                })
            })
    return menus; 
}