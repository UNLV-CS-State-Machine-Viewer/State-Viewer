// on clicking a event button
function sendbutton(name) {
    // creates obj containing "type" and "event"
    var obj = {
        "type": "event",
        "name": name
    }
    // sends object to backend
    send(obj);
    // calls logger function which adds current event to log 
    logger(1, name);
}

// on toggling a guard
function toggleguard(name) {
    // find the guard in global array
    var guard = guards.find(e => e.name === name);
    // toggle and change color
    guard.on = !guard.on;
    // if guard is on, we fill it with a corresponding color (#8b8 (light shade of green) )
    // else if off, we fill it with (#b33 (shade of red)) 
    if (guard.on) {guard.guard.style.fill = '#8b8';}
    else {guard.guard.style.fill = '#b33';}
    // sets that specific object to "on"
    var obj = {
        "type": "guard",
        "name": name,
        "on": guard.on
    }
    // sends object to backend
    send(obj);
    // calls logger function which adds current event to log 
    logger(2, "[" + name + "]:" + guard.on);
}

function send(o) {
    console.log(o);
    ws.send(JSON.stringify(o));
}
function receive(e) {
    if (e.length < 1) {return;}
    var name = "";
    var on = -1;
    var obj
    try {obj = JSON.parse(e);} catch {logger(-1, "Invalid JSON received."); return;}
    if (obj['state'] !== undefined && obj['enter'] !== undefined) {
        name = obj.state;
        on = obj.enter;
    }
    else {logger(-1, "Invalid input received."); return;}
    // calls highlight function which starts the light/dim feature
    highlight(on, name);
}

// receive string json input from backend with this function @julien
/* accepted json format:
    {
        "state": "statename",
        "on": true/false
    }
*/
function input(e) {
    if(event.keyCode == 13) { // on return key
        var input = e.value;
        if (input.length < 1) {return;}
        e.value = "";
        var name = "";
        var on = -1;
        // parse input
        if ((input).startsWith('{')) {
            var obj
            try {obj = JSON.parse(input);} catch {logger(-1, "Invalid JSON received."); return;}
            if (obj['state'] !== undefined && obj['enter'] !== undefined) {
                name = obj.state;
                on = obj.enter;
            }
            else {logger(-1, "Invalid input received."); return;}
        }
        else {
            // also accepts "enter statename" "exit statename" for convenience
            input = input.split(' ');
            if (input.length != 2) {logger(-1, "Invalid input \'" + input.join(' ') + "\'"); return;}
            if (input[0] == "enter") {on = 1;}
            else if (input[0] == "exit") {on = 0;}
            else {logger(-1, "No such action \'" + input[0] + "\'"); return;}
            name = input[1];
        }
        // calls highlight function which starts the light/dim feature
        highlight(on, name);
    }
}

// lights or dims a state by name
function highlight(on, name) {
    var i = states.findIndex(e => {return e.name == name})
    if (i >= 0) { // if state exists
        if (on) { // light state
            dolit(true, i);
            logger(3, name);
        }
        else { // dim state
            dolit(false, i);
            logger(4, name);
        }
    }
    else {
        logger(-1, "State \'" + name + "\' doesn't exist.");
    }
}
// change color of svg elements for on/off states
function dolit(on,index) {
    var state = states[index];
    // calculate color from depth
    var mult = state.depth % 5;
    var offcolor = [255, 255-((mult+1)*20), 255-((mult+1)*30)];
    var oncolor = [255-((mult+1)*30), 255, 255-((mult+1)*20)];

    if (on) { // light state and scroll to it
        state.box.setAttribute('fill', 'rgb('+oncolor[0]+','+oncolor[1]+','+oncolor[2]+')');
        state.box.scrollIntoViewIfNeeded(false);
        page.scroll(0,0);
        window.scroll(0,0);
    }
    else { // dim state
        state.box.setAttribute('fill', 'rgb('+offcolor[0]+','+offcolor[1]+','+offcolor[2]+')');
    }
}

// adds line to log when something happens
function logger(type,name) {
    // create log message
    var message = document.createElement('div');
    message.style.borderBottom = '1px solid #aaa';
    message.style.marginLeft = "2px";
    message.style.fontFamily = 'Courier New';
    message.style.fontSize = '13px';

    // send message with info
    var info = "";
    switch(type) {
        case -1:{info = "Error: ";       message.style.backgroundColor = "#FCC"; break;}
        case 1: {info = "Send event: ";  message.style.backgroundColor = "#DDF"; break;}
        case 2: {info = "Set guard: ";   message.style.backgroundColor = "#FDF"; break;}
        case 3: {info = "Enter State: "; message.style.backgroundColor = "#DFF"; break;}
        case 4: {info = "Exit State: ";  message.style.backgroundColor = "#FFD"; break;}
        default: {break;}
    }
    message.innerHTML = info.bold() + name;
    log.insertBefore(message, log.childNodes[0]);
}