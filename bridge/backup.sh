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

echo cp -r -p /var/www ./var
sudo cp -r -p /var/www ./var


find . | grep -v z_backup | cpio -pdvum logs/z_backup
