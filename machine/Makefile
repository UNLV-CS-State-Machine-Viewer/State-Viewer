MODEL = Device
BACK-END = c++ 
IMPL = $(MODEL)Impl

all: build

build:
	@printf "**** Building an executable model ****\n"
	g++ -c -Wall $(MODEL).cpp -o $(MODEL).o
	g++ -c -Wall $(IMPL).cpp -o $(IMPL).o
	g++ -c -Wall testDrv.cpp -o testDrv.o
	g++ -c -Wall sendEvent.cpp -o sendEvent.o
	g++ -c -Wall eventLoop.cpp -o eventLoop.o
	g++ -Wall main.cpp $(MODEL).o $(IMPL).o testDrv.o sendEvent.o eventLoop.o -o event_loop

run:
	@printf "**** Running the executable model ****\n"
	./test

