        
#include <stdio.h>
#include <assert.h>
#include <string.h>
#include "Device.h"
#include "sendEvent.h"

extern Device sm;

typedef struct DeviceEvent {
    EventSignal super;
    int data1;
    int data2;
} DeviceEvent;


void sendEvent_send(unsigned int signal) {
    // Instantiate an event
    DeviceEvent event;
    char signalName[100];
    
    switch (signal) {


    case Device::PowerOff:
        strcpy(signalName, "PowerOff");
        break;    

    case Device::Fault:
        strcpy(signalName, "Fault");
        break;    

    case Device::POR:
        strcpy(signalName, "POR");
        break;    

    case Device::Complete:
        strcpy(signalName, "Complete");
        break;    

    case Device::Stop:
        strcpy(signalName, "Stop");
        break;    

    case Device::RTI:
        strcpy(signalName, "RTI");
        break;    

    case Device::Drive:
        strcpy(signalName, "Drive");
        break;    

    case Device::Calibrate:
        strcpy(signalName, "Calibrate");
        break;    

    case Device::PowerOn:
        strcpy(signalName, "PowerOn");
        break;    

    case Device::Resume:
        strcpy(signalName, "Resume");
        break;    

    default:
        assert(0);
    }


    printf("\n--> %s\n", signalName);
    event.super.sig = signal;
    sm.printExitTransition();
    sm.update(&event.super);
    sm.printEntryTransition();
    sm.printActiveState();
}

