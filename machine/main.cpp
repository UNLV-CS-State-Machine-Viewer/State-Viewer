        
#include <stdio.h>
#include "Device.h"
#include "sendEvent.h"
#include "testDrv.h"
#include "eventLoop.h"
//#include "eventLoop.h"


// Instantiate the state-machine
Device sm;

int main(void) {

    // Initialize the state-machine
    sm.init();
    
    eventLoop(sm);
    // Drive the state-machine
    //testDrv();

}

