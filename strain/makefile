
USER = -DUTK
HEADEP = strain.h bool.h
HEAD += -I. -I../include
CFLAGS += $(USER) -g $(HEAD) -pthread -DLOC_DEBUG
LDFLAGS+= -g -pthread -lm

OBJ=strain.o utils.o 

all: strain 

strain.o: strain.h $(HEADEP) strain.c 

strain: $(OBJ) 

clean:
	rm -f strain $(OBJ) 

