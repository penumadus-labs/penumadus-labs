#!/bin/bash

#args:
#1 local add   
#2 port   
#3 numpoints total variation is controlled to <.2% +/- per point 

#4 number of random events with var of exactly 10% per pt for 100 pts

./gdata 127.0.0.1 32000 100000 4 1>data.csv 2>debug.log
