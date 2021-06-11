all: prelim 

CFLAGS+= -g

prelim: prelim.o curly.o js.o
	$(CC) $(CFLAGS) $(LDFLAGS) -o prelim prelim.o curly.o -lcurl
	
