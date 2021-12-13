//resize the diagram
function resize(s) {
    size = s;
    // multiply every element's position/size attributes by new size
    svg.setAttribute('width', data.size[0]*size);
    svg.setAttribute('height', data.size[1]*size);
    states.forEach(state => {
        state.box.setAttribute('x', state.pos[0]*size);
        state.box.setAttribute('y', state.pos[1]*size);
        state.box.setAttribute('width', state.pos[2]*size);
        state.box.setAttribute('height', state.pos[3]*size);
        state.box.setAttribute('rx', size);
        state.box.setAttribute('stroke-width', size/5);
        state.text.setAttribute('x', state.pos[0]*size + size);
        state.text.setAttribute('y', state.pos[1]*size + 2*size);
        state.text.setAttribute('font-size', size*1.8);
        state.entry.setAttribute('x', state.pos[0]*size + size);
        state.entry.setAttribute('y', state.pos[1]*size + 3.5*size);
        state.entry.setAttribute('font-size', size*1.5);
        state.exit.setAttribute('x', state.pos[0]*size + size);
        state.exit.setAttribute('y', state.pos[1]*size + 4.8*size);
        state.exit.setAttribute('font-size', size*1.5);
    });
    transitions.forEach(transition => {
        transition.lines.forEach(line => {
            if (!line.l) {
                line.line.setAttribute('cx', line.x*size);
                line.line.setAttribute('cy', line.y*size);
                line.line.setAttribute('r', size/2);
            } else {
                line.line.setAttribute('stroke-width', size/4);
                line.line.setAttribute('x1', line.x1*size);
                line.line.setAttribute('y1', line.y1*size);
                line.line.setAttribute('x2', line.x2*size);
                line.line.setAttribute('y2', line.y2*size);
            }
        });
        transition.text.setAttribute('x', (transition.pos[0]+transition.tpos[0])*size);
        transition.text.setAttribute('y', (transition.pos[1]+transition.tpos[1])*size + 1.5*size);
        transition.text.setAttribute('font-size', size*1.5);
    });
    guards.forEach(guard => {
        guard.guard.setAttribute('stroke-width', size/4);
        guard.guard.setAttribute('x', guard.pos[0]*size);
        guard.guard.setAttribute('y', guard.pos[1]*size);
        guard.guard.setAttribute('width', 2*size);
        guard.guard.setAttribute('height', 2*size);
        guard.guard.setAttribute('transform', 'rotate(45,' + guard.pos[0]*size + ',' + guard.pos[1]*size + ')');
    })
}

//change sizes of window elements
function sizer() {
    var wwidth = window.innerWidth;
    var wheight = window.innerHeight;

    if (wwidth / wheight < 1.2) { //if screen is thin
        drawing.style.width = wwidth + 'px';
        bmenu.style.height = '25px';
        gmenu.style.height = '20px';
        gmenu.style.marginTop = '25px';
        gmenu.style.marginLeft = '0px';
        zmenu.style.marginTop = '50px';
        zmenu.style.left = '9px';
        zmenu.style.width = wwidth - 10 + 'px';
        inbox.style.width = wwidth - 130 + 'px';
        drawing.style.marginTop = '75px';
        drawing.style.height = wheight - 190 + 'px';
        log.style.width = wwidth - 20 + 'px';
        log.style.height = '100px';
        buttons.forEach(b => {
            if (b.button) {b.button.style.display = '';}
            if (b.label) {b.label.style.display = '';}
        })
    }
    else { //screen is landscape
        drawing.style.right = "5px";
        drawing.style.marginTop = '30px';
        drawing.style.width = wwidth - drawingwidth - 5 + 'px';
        drawing.style.height = wheight - 45 + 'px';
        bmenu.style.height = wheight + 'px';
        gmenu.style.height = wheight + 'px';
        gmenu.style.marginTop = '0px';
        gmenu.style.marginLeft = buttonwidth + 60 + 'px';
        zmenu.style.marginTop = '0px';
        zmenu.style.left = drawingwidth + 'px';
        zmenu.style.width = wwidth - drawingwidth + 'px';
        inbox.style.width = wwidth - drawingwidth - 125 + 'px';
        log.style.width = drawingwidth - 20 + 'px';
        log.style.height = wheight - logheight - 5 + 'px';
        log.style.bottom = '7px';
        buttons.forEach(b => {
            if (b.button) {b.button.style.display = 'block';}
            if (b.label) {b.label.style.display = 'block';}
        })
    }
}

//zoom the diagram, called by buttons
function zoom(type) {
    var scrolly = drawing.scrollTop / (drawing.scrollHeight - drawing.clientHeight);
    var scrollx = drawing.scrollLeft / (drawing.scrollWidth - drawing.clientWidth);
    switch(type) {
        //max
        case 0: {
            //max ratio to fit diagram
            var s = Math.min((window.innerWidth - drawingwidth) / data.size[0], (drawing.offsetHeight) / data.size[1]);
            resize(s);
            break;
        }
        // + zoom in
        case 1: {resize(size*1.2); break;}
        // - zoom out
        case 2: {resize(size/1.2); break;}
    }
    //attempt to keep scroll progress after zooming
    drawing.scroll(scrollx*(drawing.scrollWidth-drawing.clientWidth), scrolly*(drawing.scrollHeight-drawing.clientHeight));
}
