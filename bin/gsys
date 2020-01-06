#!/bin/bash
if [ $# -lt 1 ]
then
	echo Usage $0 [start stop status] [ long ]
	echo or $0 monitor
	exit 0
fi

if [ $1 ==  "monitor"  ]
then
	ngrep port 8094
	exit 0
fi

for i in influxdb kapacitor chronograf
do
	if [ $1 == "status" ]
	then
		if [ "$2" == "long" ]
		then
			sudo systemctl $1 $i
		else
			echo -n $i:
			sudo systemctl $1 $i | grep Active
		fi
	else
		sudo systemctl $1 $i
		if [ $? -ne 0 ]
		then
			exit 1 
		fi
	fi
done
