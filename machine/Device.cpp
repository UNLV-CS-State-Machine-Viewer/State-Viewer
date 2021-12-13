
    
#include "stdio.h"
#include "assert.h"
#include "Device.h"
#include "sendEvent.h"
#include <algorithm>
#include <iostream>

using namespace std;

void Device::init()
{
    offEntry();
    this->state = Off;

}

const vector<string> Device::commandList {
    "PowerOff",
    "Fault",
    "POR",
    "Complete",
    "Stop",
    "RTI",
    "Drive",
    "Calibrate",
    "PowerOn",
    "Resume",
    "Cal_Ready_True",
    "Cal_Ready_False"
};

void Device::printEventList(){
    printf("Command list:\n");
    for ( int i = 0; i < COMMAND_COUNT ; i++){
        std::cout << commandList[i] << endl;
    }
}

bool Device::validEvent ( const string &value ,  const vector<string> &events){
    return find(events.begin(), events.end(),  value) != events.end();
}

void Device::printActiveState(){
    switch(this->state){
        case Initializing:
            std::cout << "Active State: Initializing\n";
            break;
        case Driving:
            std::cout << "Active State: Driving\n";
            break;
        case Calibrating:
            std::cout << "Active State: Calibrating\n";
            break;        
        case Idle:
            std::cout << "Active State: Idle\n";
            break;
        case Off:
            std::cout << "Active State: Off\n";
            break;
        case Recovery:
            std::cout << "Active State: Recovery\n";
            break;
        case Diagnostics:
            std::cout << "Active State: Diagnostics\n";
            break;
            
    }
}

void Device::printExitTransition(){
      switch(this->state){
        case Initializing:
            printf("{'state': 'Initializing', 'enter':false}\n");
            break;
        case Driving:
            printf("{'state': 'Driving', 'enter':false}\n");
            break;
        case Calibrating:
            printf("{'state': 'Calibrating', 'enter':false}\n");
            break;        
        case Idle:
            printf("{'state': 'Idle', 'enter':false}\n");
            break;
        case Off:
            printf("{'state': 'Off', 'enter':false}\n");
            break;
        case Recovery:
            printf("{'state': 'Recovery', 'enter':false}\n");
            break;
        case Diagnostics:
            printf("{'state': 'Diagnostics', 'enter':false}\n");
            break;
            
    }
}

void Device::printEntryTransition(){
            switch(this->state){
        case Initializing:
            printf("{'state': 'Initializing', 'enter':true}\n");
            break;
        case Driving:
            printf("{'state': 'Driving', 'enter':true}\n");
            break;
        case Calibrating:
            printf("{'state': 'Calibrating', 'enter':true}\n");
            break;        
        case Idle:
            printf("{'state': 'Idle', 'enter':true}\n");
            break;
        case Off:
            printf("{'state': 'Off', 'enter':true}\n");
            break;
        case Recovery:
            printf("{'state': 'Recovery', 'enter':true}\n");
            break;
        case Diagnostics:
            printf("{'state': 'Diagnostics', 'enter':true}\n");
            break;
            
    }
}

void Device::update(EventSignal *e)
{
    switch (this->state) {
    
            /**
            * state Initializing
            */
            case Initializing:
            
            switch (e->sig) {

                case Complete:
                        initExit();
                        idleEntry();
                        this->state = Idle;

                    break;
    
                case PowerOff:
                        initExit();
                        turnOffPower();
                        offEntry();
                        this->state = Off;

                    break;
    
                case Fault:
                        reportFault();
                        initExit();
                        turnOffPower();
                        startRecovery();
                        this->state = Recovery;

                    break;
    
                case POR:
                        initExit();
                        turnOffPower();
                        turnOnPower();
                        initDevice();
                        this->state = Initializing;

                    break;
    
            }
            break;
    
            /**
            * state Driving
            */
            case Driving:
            
            switch (e->sig) {

                case Stop:
                        shutOffMotor();
                        idleEntry();
                        this->state = Idle;

                    break;
    
                case RTI:
                        motorControl();

                    break;
    
                case PowerOff:
                        shutOffMotor();
                        turnOffPower();
                        offEntry();
                        this->state = Off;

                    break;
    
                case Fault:
                        reportFault();
                        shutOffMotor();
                        turnOffPower();
                        startRecovery();
                        this->state = Recovery;

                    break;
    
                case POR:
                        shutOffMotor();
                        turnOffPower();
                        turnOnPower();
                        initDevice();
                        this->state = Initializing;

                    break;
    
            }
            break;
    
            /**
            * state Calibrating
            */
            case Calibrating:
            
            switch (e->sig) {

                case Complete:
                        calibratingExit();
                        idleEntry();
                        this->state = Idle;

                    break;
    
                case RTI:
                        doCalibrate();

                    break;
    
                case Fault:
                        reportFault();
                        calibratingExit();
                        idleEntry();
                        this->state = Idle;

                    break;
    
                case PowerOff:
                        calibratingExit();
                        turnOffPower();
                        offEntry();
                        this->state = Off;

                    break;
    
                case POR:
                        calibratingExit();
                        turnOffPower();
                        turnOnPower();
                        initDevice();
                        this->state = Initializing;

                    break;
    
            }
            break;
    
            /**
            * state Idle
            */
            case Idle:
            
            switch (e->sig) {

                case Drive:
                        idleExit();
                        startMotor();
                        this->state = Driving;

                    break;
    
                case Calibrate:
                        if (calibrateReady() ) {
                            idleExit();
                            calibratingEntry();
                            this->state = Calibrating;
                        }

                    break;
    
                case PowerOff:
                        idleExit();
                        turnOffPower();
                        offEntry();
                        this->state = Off;

                    break;
    
                case Fault:
                        reportFault();
                        idleExit();
                        turnOffPower();
                        startRecovery();
                        this->state = Recovery;

                    break;
    
                case POR:
                        idleExit();
                        turnOffPower();
                        turnOnPower();
                        initDevice();
                        this->state = Initializing;

                    break;
    
            }
            break;
    
            /**
            * state Off
            */
            case Off:
            
            switch (e->sig) {

                case PowerOn:
                        offExit();
                        turnOnPower();
                        initDevice();
                        this->state = Initializing;

                    break;
    
            }
            break;
    
            /**
            * state Recovery
            */
            case Recovery:
            
            switch (e->sig) {

                case Complete:
                        recoveryExit();
                        diagnosticsEntry();
                        this->state = Diagnostics;

                    break;
    
                case RTI:
                        doSafe();

                    break;
    
            }
            break;
    
            /**
            * state Diagnostics
            */
            case Diagnostics:
            
            switch (e->sig) {

                case Resume:
                        diagnosticsExit();
                        turnOnPower();
                        initDevice();
                        this->state = Initializing;

                    break;
    
                case RTI:
                        doDiagnostics();

                    break;
    
            }
            break;
    
        default:
        assert(0);
    }
}
    