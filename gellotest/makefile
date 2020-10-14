#STATICFLAG=-static

OTHERINCLUDE=../hank/hank-latest-3.1/include
INCLUDE+=-I. -I$(OTHERINCLUDE) -I../DM
LFLAGS+=-g $(STATICFLAG) -pthread -lm
CFLAGS+=-g $(STATICFLAG) $(INCLUDE) -pthread 
HEAD=bool.h 
SENSEDM=gdata dbtestmon


all: $(SENSEDM) 


utils.o: ../DM/utils.c  $(HEAD)
	cc -c ../DM/utils.c -o  utils.o $(CFLAGS) $(LFLAGS)

gdata.o: gdata.c  $(HEAD)
	cc -c gdata.c $(CFLAGS) $(LFLAGS)

gdata: gdata.o  utils.o $(HEAD) 
	cc -o gdata gdata.o utils.o $(CFLAGS) $(LFLAGS)

dbtestmon.o: dbtestmon.c  $(HEAD)
	cc -c dbtestmon.c $(CFLAGS) $(LFLAGS)

dbtestmon: dbtestmon.o  ../DM/portsetup.o utils.o ../DM/outputbin.o ../DM/parsetbl.o  $(HEAD) 
	cc -g -o dbtestmon dbtestmon.o utils.o ../DM/parsedata.o ../DM/dbcomms.o ../DM/parsetbl.o \
		../DM/outputbin.o ../DM/portsetup.o $(CFLAGS) $(LFLAGS)

clean:
	rm -f $(SENSEDM) *.o 
