export default function weathersymbol(id:number,isDay:0|1) {
    
    let string = "banana-weather-XXXXYYYY-symbolic";
    let symbol = ""
    let nontime = false;
    //NON DAY SPECIFIC
    if([56,57,66, 67].includes(id)) {
        symbol = "freezingrain"
        nontime =true
    }
    if([3].includes(id)) {
        symbol = "cloudy"
        nontime =true
    }
    if([51, 53, 55].includes(id)) {
        symbol="drizzle"
        nontime =true
    }
    if([45, 48].includes(id)) {
        symbol="fog"
        nontime =true
    }
    if([63, 65,81, 82].includes(id)) {
        symbol = "rain"
        nontime =true
    }
    if([86,77,73,75].includes(id)) {
        symbol="snow"
        nontime =true
    }
    if([96, 99 ,95].includes(id)) {
        symbol="thunder"
        nontime =true
    }
    //TIME SPECIFIC
    if([0].includes(id)) {
        symbol="clear"
    }
    if([61].includes(id)) {
        symbol = "lightrain"
    }
    if([1, 2,].includes(id)) {
        symbol = "partlycloudy"
    }
    if([71,85].includes(id)) {
        symbol = "snowlight"
    }

    let dayString = isDay>0?"-day":"-night"
    if(nontime) {
        dayString=""
    }
    return string.replace("XXXX",symbol).replace("YYYY",dayString);
}