all: stub

stub.o: stub.c utils.h stub.h
utils.o: utils.c stub.h utils.h

stub: stub.o utils.o utils.h stub.h
	$(CC) -o stub stub.o utils.o 

install: stub
	sudo cp stub /var/www/html/cgi-bin
	sudo rm -f  /tmp/stub.log
	sudo chown www-data /var/www/html/cgi-bin/stub

clean:
	rm *.o stub
