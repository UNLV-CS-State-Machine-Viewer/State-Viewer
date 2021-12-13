// draw the diagram with svg elements
function draw(data) {
    data.state.forEach(state => {
        var pos = state.positions;
        // box representing the state
        var box = document.createElementNS(ns, 'rect');
        box.setAttribute('x', pos[0]*size);
        box.setAttribute('y', pos[1]*size);
        box.setAttribute('width', pos[2]*size);
        box.setAttribute('height', pos[3]*size);
        box.setAttribute('rx', size*3);
        box.setAttribute('stroke-width', size);
        box.setAttribute('stroke', '#000');
        // name of that box that represents that state
        var text = document.createElementNS(ns, 'text');
        text.setAttribute('x', pos[0]*size + size);
        text.setAttribute('y', pos[1]*size + 2*size);
        text.setAttribute('fill', '#0');
        text.setAttribute('font-size', size*2);
        text.textContent = state.name;
        // entry text that indicates that the state is activated
        var entrytext = document.createElementNS(ns, 'text');
        entrytext.setAttribute('x', pos[0]*size + size);
        entrytext.setAttribute('y', pos[1]*size + 3*size);
        entrytext.setAttribute('fill', '#0');
        entrytext.setAttribute('font-size', size*1.5);
        entrytext.textContent = 'e/' + state.entry;
        // exit text that indicates that the state is deactivated
        var exittext = document.createElementNS(ns, 'text');
        exittext.setAttribute('x', pos[0]*size + size);
        exittext.setAttribute('y', pos[1]*size + 4*size);
        exittext.setAttribute('fill', '#0');
        exittext.setAttribute('font-size', size*1.5);
        exittext.textContent = 'x/' + state.exit;
        // add state to global array
        var obj = {
            'name': state.name,
            'box': box,
            'text': text,
            'entry': entrytext,
            'exit': exittext,
            'on': false,
            'depth': state.depth,
            'pos': pos
        }
        // adds the above draw portions into the overall svg
        svg.appendChild(obj.box);
        svg.appendChild(obj.text);
        svg.appendChild(obj.entry);
        svg.appendChild(obj.exit);
        states.push(obj);
    });
    // lamda function that draws lines between the relevant events/states
    data.trans.forEach(transition => {
        var pos = transition.positions;
        var tpos = transition.textpos;
        var x = pos[0];
        var y = pos[1];
        // begin draw line
        var lines = [];
        if (transition.init) { // if init draw a circle first
            var circle = document.createElementNS(ns, 'circle');
            circle.setAttribute('cx', x*size);
            circle.setAttribute('cy', y*size);
            circle.setAttribute('r', size/2);
            circle.setAttribute('fill', '#000');
            // add circle to line array
            var obj = {
                'l': false,
                'line': circle,
                'x': x,
                'y': y
            }
            lines.push(obj);
        }
        // hack to make POR and first init work for now, not sure why they start with a vertical line instead of horizontal like all the other transitions
        if(!transition.target || !transition["parent"]) {pos.splice(4,0,0);}
        // draw each line segment
        for (var i = 4; i < pos.length; i += 1) {
            var line = document.createElementNS(ns, 'line');
            if (i+1 == pos.length) { // draw arrow
                if (pos[i] > 0) {pos[i] -= 1.3;} else {pos[i] += 1.3;}
                line.setAttribute('marker-end', 'url(#head)');
            }
            line.setAttribute('stroke', '#000');
            line.setAttribute('stroke-width', size/4);
            line.setAttribute('x1', x*size);
            line.setAttribute('y1', y*size);
            var x1 = x; var y1 = y;
           if (i%2) {y += pos[i];} else {x += pos[i];}
            line.setAttribute('x2', x*size);
            line.setAttribute('y2', y*size);
            // add line element to line array
            var obj = {
                'l': true,
                'line': line,
                'x1': x1,
                'y1': y1,
                'x2': x,
                'y2': y
            }
            lines.push(obj);
        }
        // name
        var name = " ";
        if (!transition.init) {
            name = transition.name;
            tpos = transition.textpos;
        }
        var text = document.createElementNS(ns, 'text');
        text.setAttribute('x', (pos[0]+tpos[0])*size);
        text.setAttribute('y', (pos[1]+tpos[1])*size + size);
        text.setAttribute('fill', '#0');
        text.setAttribute('font-size', size*1.5);
        var action = "";
        if (transition.action && transition.action.length > 0) {
            action = "/" + transition.action;
        }
        text.textContent = name + action;
        // add transition to global array
        var obj = {
            'name': name,
            'lines': lines,
            'text': text,
            'pos': pos,
            'tpos': tpos
        }
        obj.lines.forEach(line => {svg.appendChild(line.line)})
        svg.appendChild(obj.text);
        transitions.push(obj);
    });
    data.guard.forEach(guard => {
        var pos = guard.positions;
        // diamond
        var diamond = document.createElementNS(ns, 'rect');
        diamond.setAttribute('stroke', '#000');
        diamond.setAttribute('stroke-width', size/4);
        diamond.setAttribute('x', pos[0]*size);
        diamond.setAttribute('y', pos[1]*size);
        diamond.setAttribute('width', 2*size);
        diamond.setAttribute('height', 2*size);
        diamond.setAttribute('fill', '#b33');
        diamond.setAttribute('transform', 'rotate(45,' + pos[0]*size + ',' + pos[1]*size + ')');
        var text = document.createElementNS(ns, 'rect');
        // add guard to global array
        var obj = {
            'name': guard.name,
            'on': false,
            'guard': diamond,
            'text': text,
            'pos': pos
        }
        guards.push(obj);
        svg.appendChild(obj.guard);
    });
}

// create interactable buttons for events and guards
function createbuttons(data) {
    var width = 0;
    var height = 0;
    var width2 = 0;
    var height2 = 0;
    data.trans.forEach(transition => {
        // if the button doesn't exist yet
        if (!transition.init && transition.target > 0 && !(buttons.some(function(o){return o["name"] === transition.name}))) {
            // create it
            var button = document.createElement("button");
            button.innerHTML = transition.name;
            button.name = transition.name;
            button.onclick = function(){sendbutton(this.name)}
            button.style.display = 'block';
            // add it to buttons array
            var obj = {
                "type": "trans",
                "name": transition.name,
                "button": button
            }
            buttons.push(obj);
            bmenu.appendChild(obj.button);
            buttonwidth = Math.max(width, button.offsetWidth + 20);
            height += button.offsetHeight;
        }
    });
    // creates labels and checks (this lamda function needs further elaboration)
    data.guard.forEach(guard => {
        var label = document.createElement('label');
        label.innerHTML = '[' + guard.name + ']';
        label.style.display = 'block';
        var check = document.createElement('input');
        check.id = guard.name;
        check.name = guard.name;
        check.type = 'checkbox';
        check.onchange = function(){toggleguard(this.name)}
        // add to buttons array
        var obj = {
            "type": "guard",
            "name": guard.name,
            "on": false,
            "checkbox": check,
            "label": label
        }
        buttons.push(obj);
        label.appendChild(obj.checkbox);
        gmenu.appendChild(obj.label);
        width2 = Math.max(buttonwidth, label.offsetWidth + 20);
        height2 += label.offsetHeight;
    });
    logheight = Math.max(height, height2) + 20;
    drawingwidth = buttonwidth + width2 + 60;
}