#include <stdio.h>
#include "sendEvent.h"
#include "Device.h"
#include<iostream>
#include<algorithm>


extern bool calibrateReadyBoolean;
using namespace std;

void processEvent(string signal){
    //Takes signal and sends the corresponding event or sets the corresponding guard
    auto event_itr = std::find(Device::commandList.begin(),Device::commandList.end(),signal);
    int choice = event_itr - Device::commandList.begin();
    //cout << signal << " corresponds to choice # " << choice << std::endl; 
    switch(choice) {
        case  Device::PowerOff:
            sendEvent_send(Device::PowerOff);
            break;
        case Device::Fault:
            sendEvent_send(Device::Fault);
            break;
        case Device::POR:
            sendEvent_send(Device::POR);
            break;
        case Device::Complete:
            sendEvent_send(Device::Complete);
            break;
        case Device::Stop:
            sendEvent_send(Device::Stop);
            break;
        case Device::RTI:
            sendEvent_send(Device::RTI);
            break;
        case Device::Drive:
            sendEvent_send(Device::Drive);
            break;
        case Device::Calibrate:
            sendEvent_send(Device::Calibrate);
            break;
        case Device::PowerOn:
            sendEvent_send(Device::PowerOn);
            break;
        case Device::Resume:
            sendEvent_send(Device::Resume);
            break;
        case 10:
            calibrateReadyBoolean = true;
            cout << "Setting calibrateReady to true\n";
            break;
        case 11:
            calibrateReadyBoolean = false;
            cout << "Setting calibrateReady to false\n";
            break;
        default:
            cout << "No action for the chosen event: " << signal <<endl;
    }
}


void eventLoop(Device sm){

    string textInput = "";
    bool endLoop = false;

    printf("Starting FSM event loop.\n");
    while (!endLoop){
        ///keep asking for 
        Device::printEventList();
        printf("To end the loop type -'END_LOOP'\n");
        cin >> textInput;
        if (textInput.compare("END_LOOP")== 0 ){
                endLoop = true;
                cout<< "ENDING INPUT LOOP\n";
        }
        else if( Device::validEvent(textInput,Device::commandList)){
            //cout << textInput << " is a valid Event!\n";
                cout << "New VALID event ENTERED: " << textInput << endl;
                processEvent(textInput);
        }
        else {
                cout << textInput << " is NOT a valid Event!\n"; 
        }

    }
}


