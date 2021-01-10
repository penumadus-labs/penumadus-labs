#!/bin/bash
# You must add following two lines before
# outputting data to the web browser from shell
# script
 echo "Content-type: text/html"
 echo ""
 echo '<H1 style="color:red;font-size:xx-large">Rebooting....</H1>'
nohup ./restart.sh -r 1>/dev/null 2>&1 &
 echo "</body></html>"

