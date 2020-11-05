
USER = -DUTK
HEADEP = netcomms.h trans.h xbee.h xbeeintfc.h bool.h aqueues.h
HEAD += -I. -I../include
CFLAGS += $(USER) -g $(HEAD) -pthread -DLOC_DEBUG
#CFLAGS += -DFULL_DEBUG 
LDFLAGS+= -g -pthread -lm

all: trans simulate defsim

trans.o: trans.h $(HEADEP) trans.c 
rem.o: trans.h $(HEADEP) rem.c 
periodic.o: trans.h $(HEADEP) periodic.c 
utils.o: trans.h utils.c
portsetup.o: $(HEADEP) portsetup.c
apiframes.o: $(HEADEP) apiframes.c
xbee.o: $(HEADEP) xbee.c
sync.o: $(HEADEP) sync.c 
wifi.o: $(HEADEP) wifi.c 
accel.o: $(HEADEP) accel.c 

simulate.o: $(HEADEP) simulate.c 
simulate: simulate.o 

defsim.o: $(HEADEP) defsim.c 
defsim: defsim.o 

trans: trans.o utils.o  portsetup.o apiframes.o xbee.o sync.o rem.o periodic.o wifi.o accel.o

clean:
	rm -f trans *.o 

