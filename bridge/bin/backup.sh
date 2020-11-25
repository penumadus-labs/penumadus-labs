#!/bin/bash

bfiles=/tmp/bridgebackupfiles
rm $bfiles

for i in etc 
do
	find $i -type f  >> $bfiles
done

for i in `cat $bfiles`
do
	echo cp -p /$i $i
	cp -p /$i $i
done

echo cp -r -p /var/www ./var/www
sudo cp -r -p /var/www ./var/www
