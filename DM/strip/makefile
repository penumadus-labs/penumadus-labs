#STATICFLAG=-static

LFLAGS+=$(STATICFLAG) -pthread
CFLAGS+=$(STATICFLAG) -pthread -I. 
HEAD=bool.h config.h
SENSEDM=UDPengine 


all: $(SENSEDM) 

utils.o: utils.c  $(HEAD)
	cc -c utils.c -o  utils.o $(CFLAGS) $(LFLAGS)

UDPengine.o: UDPengine.c  $(HEAD)
	cc -c UDPengine.c $(CFLAGS) $(LFLAGS)

UDPengine: UDPengine.o  utils.o outputbin.o parsedata.o $(HEAD) 
	cc -o UDPengine UDPengine.o utils.o parsedata.o outputbin.o $(CFLAGS) $(LFLAGS)

outputbin.o: outputbin.c  $(HEAD)
	cc -c outputbin.c $(CFLAGS) $(LFLAGS)

parsedata.o: parsedata.c  $(HEAD)
	cc -c parsedata.c $(CFLAGS) $(LFLAGS)

clean:
	rm -f $(SENSEDM) *.o 
