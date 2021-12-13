# State Viewer

A web application using a Node.JS web socket to interact and visualize a C++ state machine made from QM

## How to use

Make sure you have all the dependencies in package-lock.json

Run `node index.js` to start the server

### Window

After starting the server, the webapp can be accessed at `localhost:8081/window.html`

drag in the example [**/machine/Device.qm**](./machine/Device.qm) file.

### Machine

Currently, the server is configured to run the compiled C++ program [**/machine/event_loop**](./machine/event_loop)

this can be changed on line 10 of index.js

## Modifying the code

### Parser

**/window/parser.js** contains a single function `parse`, and is used to parse the XML file from QM into JSON

if your software produces a different format, you can change this function.

### Interaction

[**/window/interact.js**](./window/interact.js) has functions handling the back and forth JSON messages between webapp and machine, namely `send` and `receive`, both expecting a json object

currently, the webapp is expecting a message like this when a state is turned on or off:

```json
{
  "state": "Driving",
  "on": true
}
```

and sends a message like this to the machine on an event:

```json
{
  "type": "event",
  "name": "turnOnPower"
}
```

extra processing for this is done in `sendtomachine` function of [**index.js**](./index.js), this is a hack to get current example working with the intermediary JSON messages.

this file also has a `logger` function for printing out to the log window on the webapp.
