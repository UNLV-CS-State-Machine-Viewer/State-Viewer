
#ifndef DEVICE_H_
#define DEVICE_H_

#include<string>
#include<vector>
#include<algorithm>


#define COMMAND_COUNT 12
#define STATE_COUNT 7
// forward declaration of EventSignal
struct EventSignal;


class Device {
  public:
  
    enum DeviceStates {
      Initializing,
      Driving,
      Calibrating,
      Idle,
      Off,
      Recovery,
      Diagnostics,
    };

    enum DeviceEvents {
      PowerOff,
      Fault,
      POR,
      Complete,
      Stop,
      RTI,
      Drive,
      Calibrate,
      PowerOn,
      Resume,
    };

    
    
    enum DeviceStates state;
  
    
    static const std::vector<std::string> commandList; 
    static void printEventList();
    static bool validEvent(const std::string &value, const std::vector<std::string> &events);


    void init();
    void printActiveState();
    void printExitTransition();
    void printEntryTransition();
    void update(EventSignal *e);
    
    // state machine implementation functions
    bool calibrateReady();
    void turnOnPower();
    void turnOffPower();
    void initDevice();
    void initExit();
    void startMotor();
    void shutOffMotor();
    void calibratingEntry();
    void calibratingExit();
    void idleEntry();
    void idleExit();
    void offEntry();
    void offExit();
    void startRecovery();
    void recoveryExit();
    void diagnosticsEntry();
    void diagnosticsExit();
    void reportFault();
    void motorControl();
    void doCalibrate();
    void doSafe();
    void doDiagnostics();

};

#endif
    