#!/bin/bash
# You must add following two lines before
# outputting data to the web browser from shell
# script
 echo "Content-type: text/html"
 echo ""
 echo "Shell Script name is $0"
 echo '<H1 style="color:red;font-size:xx-large;">Shutting Down - please wait 15 seconds before removing power</H1>'
nohup ./restart.sh -h 1>/dev/null 2>&1 &
 echo "</body></html>"

