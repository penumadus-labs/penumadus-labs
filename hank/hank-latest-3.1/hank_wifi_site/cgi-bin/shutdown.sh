#!/bin/bash
a=$(date)
printf "Content-type:  text/html\n\n"
printf "<!DOCTYPE HTML>\n"
printf "<meta charset=\"UTF-8\">\n"
printf "\n"
printf "<HTML><HEAD></HEAD><BODY>\n"
a="<div style=\"height:100%;background-color:blue;color:white;text-align:center;font-size:xx-large;\">"
printf "%s %s\n" $a
printf "<H1>SHUTTING DOWN!</H1>\n"
printf "Wait for: <br> 1. front green to flash <br> 2. blue on top to go out<br>3. green on top to quit flashing and go out<br>4. turn off power<br>\n"
printf "</BODY></HTML>\n"
/home/hank/apacheplay/sendUDP 32159 "H "
sudo /sbin/shutdown -h now

