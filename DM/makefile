#STATICFLAG=-static

OTHERINCLUDE=../hank/hank-latest-3.1/include
INCLUDE+=-I. -I$(OTHERINCLUDE)
LFLAGS+=-g $(STATICFLAG) -pthread -lm
#CFLAGS+=-g $(STATICFLAG) $(INCLUDE) -pthread -DSIMULATOR
CFLAGS+=-g $(STATICFLAG) $(INCLUDE) -pthread 
HEAD=bool.h servercomms.h $(OTHERINCLUDE)/netcomms.h $(OTHERINCLUDE)/protocol.h parse.h
SENSEDM=UDPengine 
OBJ=UDPengine.o utils.o outputbin.o parsedata.o dbcomms.o parsetbl.o 


all: $(SENSEDM) dbtestmon


utils.o: utils.c  $(HEAD)
	cc -c utils.c -o  utils.o $(CFLAGS) $(LFLAGS)

dbcomms.o: dbcomms.c  $(HEAD)
	cc -c dbcomms.c $(CFLAGS) $(LFLAGS)

parsetbl.o: parsetbl.c  $(HEAD)
	cc -c parsetbl.c $(CFLAGS) $(LFLAGS)

UDPengine.o: UDPengine.c  $(HEAD)
	cc -c UDPengine.c $(CFLAGS) $(LFLAGS)

UDPengine: $(OBJ) $(HEAD) 
	cc -o UDPengine $(OBJ) $(CFLAGS) $(LFLAGS)

outputbin.o: outputbin.c  $(HEAD)
	cc -c outputbin.c $(CFLAGS) $(LFLAGS)

parsedata.o: parsedata.c  $(HEAD)
	cc -c parsedata.c $(CFLAGS) $(LFLAGS)


dbtestmon.o: dbtestmon.c  $(HEAD)
	cc -c -g dbtestmon.c $(CFLAGS) $(LFLAGS)
portsetup.o: portsetup.c  $(HEAD)
	cc -c -g portsetup.c $(CFLAGS) $(LFLAGS)

dbtestmon: dbtestmon.o  portsetup.o utils.o outputbin.o parsetbl.o  $(HEAD) 
	cc -g -o dbtestmon dbtestmon.o utils.o parsedata.o dbcomms.o parsetbl.o \
		outputbin.o portsetup.o $(CFLAGS) $(LFLAGS)

testdata.o: testdata.c testdata.h
	cc -c -o testdata.o testdata.c $(CFLAGS) $(LFLAGS)
testdata: testdata.o
	cc -o testdata testdata.o
	
testdatatest.o: testdatatest.c testdata.h
	cc -c -o testdatatest.o testdatatest.c $(CFLAGS) $(LFLAGS)
testdatatest: outputbin.o testdatatest.o
	cc -o testdatatest outputbin.o testdatatest.o
clean:
	rm -f $(SENSEDM) *.o dbtestmon 
