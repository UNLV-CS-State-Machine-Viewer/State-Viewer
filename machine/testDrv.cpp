#include <stdio.h>
#include "sendEvent.h"
#include "Device.h"

extern bool calibrateReadyBoolean;

void testDrv() {

     sendEvent_send(Device::PowerOn);
     sendEvent_send(Device::Complete);
     calibrateReadyBoolean = true;
     sendEvent_send(Device::Calibrate);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::Complete);
     sendEvent_send(Device::Drive);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::Fault);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::Complete);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::Resume);
     sendEvent_send(Device::Complete);
     sendEvent_send(Device::Drive);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::RTI);
     sendEvent_send(Device::Stop);
     sendEvent_send(Device::PowerOff);

}
