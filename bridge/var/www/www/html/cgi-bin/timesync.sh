#!/bin/bash
# get today's date
OUTPUT="$(date)"
# You must add following two lines before
# outputting data to the web browser from shell
# script
 echo "Content-type: text/html"
 echo ""
 echo "<html><head><title>TimeSync</title></head><body>"
#echo QUERY is:  $QUERY_STRING 
#echo dir is:  $(pwd)
#echo "<H1 style="font-size:xx-large">Current Date on server is: $(date) <br></H1>"
#echo "<H1 style="font-size:xx-large">seconds on server  is $(date +%s)<br></H1>"
./setthetime $QUERY_STRING
echo "</body></html>"
