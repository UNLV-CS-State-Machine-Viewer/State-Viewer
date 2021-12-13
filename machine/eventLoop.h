#ifndef _EVENT_LOOP_H_
#define _EVENT_LOOP_H_

#include"Device.h"
#include<string>

void processEvent(std::string  signal);
void eventLoop(Device sm);

#endif
