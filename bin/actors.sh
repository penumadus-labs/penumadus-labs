#!/bin/bash

PATH=$PATH:$HOME/bin

if [ "$1" == "GOOD" ]
then
	echo "====================GOOD ACTORS=========="
	grep Accepted /var/log/auth.log | cut -d' ' -f1-3,11,13 | gooduns

elif [ "$1" == "BAD" ]
then
	echo "====================BAD ACTORS=========="
	grep Invalid /var/log/auth.log | cut -d' ' -f1-3,10,12  | gooduns 
else
	echo "====================GOOD ACTORS=========="
	grep Accepted /var/log/auth.log | cut -d' ' -f1-3,11,13 | gooduns
	echo "====================BAD ACTORS=========="
	grep Invalid /var/log/auth.log | cut -d' ' -f1-3,10,12  | gooduns 
fi

