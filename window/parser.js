function parse(obj, parent, depth) {
    // sets childNodes equal to the childNodes of the 'obj' parameter
    var childNodes = obj.childNodes;
    var ii = 0;

    for(var i=0; i<childNodes.length; i++) {
        var child = childNodes[i];
        if (child.nodeName == 'initial') { //init states
            // parse out target index int from "../../N"
            var tn = child.getAttribute('target');
            var t = -1;
            if(tn != "..") {
                tn = tn.replace(/\D/g,'');
                t = parseInt(tn);
            }
            // parse out positions into int array
            var tx = child.getElementsByTagName('initial_glyph')[0].getAttribute('conn');
            tx = tx.split(',');
            var x = [];
            tx.forEach(e => x.push(parseInt(e)));

            var txx = child.getElementsByTagName('initial_glyph')[0].getElementsByTagName('action')[0].getAttribute('box');
            txx = txx.split(',');
            var xx = [];
            txx.forEach(e => xx.push(parseInt(e)));

            var jt = {
                "init":true,
                "name":"initial",
                "parent":parent,
                "target": t,
                "positions":x,
                "textpos": xx
            };
            // push to transitions array
            data.trans.push(jt);
            ii++;
        }
        else if(child.nodeName == 'state') { //states, can have children
            // name
            var name = child.getAttribute('name');
            // entry and exit events
            var entry = child.getElementsByTagName('entry')[0];
            if (entry) {entry = entry.getAttribute('brief');} else {entry = "";}
            if (!entry) {entry = "";}
            var exit = child.getElementsByTagName('exit')[0];
            if (exit) {exit = exit.getAttribute('brief');} else {exit = "";}
            if (!exit) {exit = "";}
            // parse out positions into int array
            var txa = child.getElementsByTagName('state_glyph');
            var tx = txa[txa.length - 1].getAttribute('node');
            tx = tx.split(',');
            var x = [];
            tx.forEach(e => x.push(parseInt(e)));

            // parse out the text position
            var txx = child.getElementsByTagName('tran_glyph')[0];
            if (txx) {txx = txx.getElementsByTagName('action')[0].getAttribute('box');}
            else {txx = "-5,-5";}
            txx = txx.split(',');
            var xx = [];
            txx.forEach(e => xx.push(parseInt(e)));

            var jt = {
                "name":name,
                "entry":entry,
                "exit":exit,
                "parent":parent,
                "depth":depth,
                "positions":x,
                "textpos":xx
            }
            // push to states array
            data.state.push(jt);

            // recurse through child states
            parse(child, name, depth+1);

            // increment index
            ii++;
        }
        else if(child.nodeName == 'tran') { //transitions
            // Assign name of transition
            var name = child.getAttribute('trig');
            var tn = child.getAttribute('target');
            var guarded = false
            var t = -1;
            if (tn != "..") {t = -2;}
            if (tn != null) {
                tn = tn.replace(/\D/g,'');
                t = parseInt(tn);
            }
            // actions during transition
            var action = child.getElementsByTagName('action')[0];
            if (action) {action = action.getAttribute('brief');} else {action = "";}
            if (!action) {action = "";}
            
            // parse out positions into int array
            var tx = child.getElementsByTagName('tran_glyph')[0].getAttribute('conn');
            tx = tx.split(',');
            var x = [];
            tx.forEach(e => x.push(parseInt(e)));

            // parse out the text position
            var txx = child.getElementsByTagName('tran_glyph')[0].getElementsByTagName('action')[0].getAttribute('box');
            txx = txx.split(',');
            var xx = [];
            var y = [];
            var yy = [];
            txx.forEach(e => xx.push(parseInt(e)));

            // parse out guards
            var guard = child.getElementsByTagName('choice')[0];
            if (guard != null)  {
                guarded = true;
                action = child.getElementsByTagName('choice')[0].getElementsByTagName('guard')[0].getAttribute('brief');
                tx = child.getElementsByTagName('choice')[0].getElementsByTagName('choice_glyph')[0].getAttribute('conn');
                tx = tx.split(',');
                tx.forEach(e => y.push(parseInt(e)));
                txx = child.getElementsByTagName('choice')[0].getElementsByTagName('choice_glyph')[0].getElementsByTagName('action')[0].getAttribute('box');
                txx = txx.split(',');
                txx.forEach(e => yy.push(parseInt(e)));

            }
            // configures jt variable which such values in order to push to transition array
            var jt = {
                "init": false,
                "name":name,
                "action":action,
                "target":t,
                "parent":parent,
                "positions":x,
                "textpos":xx
            }

            // push to Transitions array
            data.trans.push(jt);

            // depending if the guard is true or false, it'll have its specific configuration
            if (guarded == true) {
                var ja = {
                    "name": action,
                    "parent": name,
                    "positions": y
                }
                var jt = {
                    "init":false,
                    "name":'['+action+']',
                    "target": null,
                    "positions": y,
                    "textpos": yy
                }
                // push to guard/transitions arrays
                data.guard.push(ja);
                data.trans.push(jt);
            }
            // increment index
            ii++;
        }
    }
}