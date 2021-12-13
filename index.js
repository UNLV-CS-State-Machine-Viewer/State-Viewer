const WebSocket = require('ws')
const express = require('express')
const app = express()
app.use(express.static("./window"))
app.listen(8081)
//localhost:8081/window.html
const wss = new WebSocket.Server({ port: 8080 })
const cp = require('child_process')
//machine to run
const machine = cp.exec('./machine/event_loop')

machine.stdout.on('data', e => {
    const data = e.split('\n').filter(entry => entry.startsWith("{"));
    for (const d in data) {
        console.log(data[d]);
        wss.clients.forEach(client => {
            client.send(""+data[d])
        })
    }
});

wss.on('connection', ws => {
  ws.on('message', message => {
    console.log(`Received message: ${message}`)
    sendtomachine(JSON.parse(message))
  })
})

function sendtomachine(e) {
    if (e.type == "ready") {
        return
    }
    var name;
    if (e.type == "event") {
        name = e.name;
    }
    else if (e.type == "guard") {
        name = e.name + "_" + e.on
    } else {return}
    console.log(name)
    machine.stdin.write(name + "\n")
}