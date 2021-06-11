#!/bin/bash
if [ $# -eq 0 ]
then
	lroot="."
else
	lroot="$1"
fi

tmpfile=$(mktemp --tmpdir=/tmp XXXX.sizes)
echo tmpfile is $tmpfile

t=0

for i in `ls -a $lroot`
do
	t=$(($t+1))
	echo  -n -e "\r$t" >/dev/tty
	a=$(du -sh $i)
	echo  "$a" >> $tmpfile
done
echo -e "\n"
sort -rh $tmpfile
rm $tmpfile
