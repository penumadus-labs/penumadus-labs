#!/bin/bash

touch /tmp/logmaint
ROOTLOGS=/home/ubuntu/logs
ROOTNAME=$ROOTLOGS/oldlogs
echo ROOT DIRECTORY FOR LOGS BACKUP IS $ROOTNAME
mkdir $ROOTNAME
rm -rf $ROOTNAME/10
for i in 9 8 7 6 5 4 3 2 1
do
        N=$((i+1))
        mv $ROOTNAME/$i $ROOTNAME/$N
done

A=`date`
A="CLEARED ON $A"
mkdir $ROOTNAME/1
myfiles=$(ls $ROOTLOGS | grep "^e_")
myfiles+=" "
myfiles+=$(ls $ROOTLOGS | grep "^MSGLOG")
myfiles+=" "
myfiles+=sessions.log
myfiles+=" "
myfiles+=$(ls $ROOTLOGS | grep "^backup_")
for i in $myfiles
do
        echo "$ROOTLOGS/$i $A"
        cp $ROOTLOGS/$i $ROOTNAME/1/$i
        echo $A >$ROOTLOGS/$i
done

A=`date +%m-%d-%Y`
A="$A-LOG-BACKUP"
date > $ROOTNAME/1/$A

