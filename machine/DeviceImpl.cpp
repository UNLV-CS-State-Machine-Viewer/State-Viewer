
    
#include <stdbool.h>
#include <stdio.h> 

#include "Device.h"

bool calibrateReadyBoolean;

bool Device::calibrateReady() {
    printf("DeviceImpl_calibrateReady() is %d\n", calibrateReadyBoolean);
    return calibrateReadyBoolean;
}

void Device::turnOnPower() {
    printf("DeviceImpl_turnOnPower()\n");
}
void Device::turnOffPower() {
    printf("DeviceImpl_turnOffPower()\n");
}
void Device::initDevice() {
    printf("DeviceImpl_initDevice()\n");
}
void Device::initExit() {
    printf("DeviceImpl_initExit()\n");
}
void Device::startMotor() {
    printf("DeviceImpl_startMotor()\n");
}
void Device::shutOffMotor() {
    printf("DeviceImpl_shutOffMotor()\n");
}
void Device::calibratingEntry() {
    printf("DeviceImpl_calibratingEntry()\n");
}
void Device::calibratingExit() {
    printf("DeviceImpl_calibratingExit()\n");
}
void Device::idleEntry() {
    printf("DeviceImpl_idleEntry()\n");
}
void Device::idleExit() {
    printf("DeviceImpl_idleExit()\n");
}
void Device::offEntry() {
    printf("DeviceImpl_offEntry()\n");
}
void Device::offExit() {
    printf("DeviceImpl_offExit()\n");
}
void Device::startRecovery() {
    printf("DeviceImpl_startRecovery()\n");
}
void Device::recoveryExit() {
    printf("DeviceImpl_recoveryExit()\n");
}
void Device::diagnosticsEntry() {
    printf("DeviceImpl_diagnosticsEntry()\n");
}
void Device::diagnosticsExit() {
    printf("DeviceImpl_diagnosticsExit()\n");
}
void Device::reportFault() {
    printf("DeviceImpl_reportFault()\n");
}
void Device::motorControl() {
    printf("DeviceImpl_motorControl()\n");
}
void Device::doCalibrate() {
    printf("DeviceImpl_doCalibrate()\n");
}
void Device::doSafe() {
    printf("DeviceImpl_doSafe()\n");
}
void Device::doDiagnostics() {
    printf("DeviceImpl_doDiagnostics()\n");
}


