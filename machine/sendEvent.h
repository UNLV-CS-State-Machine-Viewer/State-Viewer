        
#ifndef _SEND_EVENT_H
#define _SEND_EVENT_H

class Device;

typedef struct EventSignal {
    unsigned int sig;
} EventSignal;

void sendEvent_send(unsigned int signal);

#endif

