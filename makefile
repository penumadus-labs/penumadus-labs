all: doall

doall:
	cd DM; make
	cd hank/hank-latest-3.1/wifipi ; make

clean:
	cd DM; make clean
	cd hank/hank-latest-3.1/wifipi ; make clean
