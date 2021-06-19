
USER = -DUTK
HEADEP = ../include/protocol.h ../include/netcomms.h
HEAD += -I. -I../include
CFLAGS += $(USER) -g $(HEAD) -pthread
LDFLAGS+= -g -pthread

all: wifipi

wifipi.o: wifipi.h $(HEADEP) 
utils.o: wifipi.h 
portsetup.o: wifipi.h $(HEADEP) 
wififrames.o: wifipi.h $(HEADEP) 

wifipi: wifipi.o utils.o  portsetup.o wififrames.o

clean:
	rm -f wifipi *.o 

