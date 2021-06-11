#!/bin/bash

logs=/var/log/nginx/access.log

>/tmp/biglog
gzip -d -c $logs.10.gz >>/tmp/biglog
gzip -d -c $logs.9.gz >>/tmp/biglog
gzip -d -c $logs.8.gz >>/tmp/biglog
gzip -d -c $logs.7.gz >>/tmp/biglog
gzip -d -c $logs.6.gz >>/tmp/biglog
gzip -d -c $logs.5.gz >>/tmp/biglog
gzip -d -c $logs.3.gz >>/tmp/biglog
gzip -d -c $logs.2.gz >>/tmp/biglog
cat $logs.1 $logs >> /tmp/biglog

cat /tmp/biglog | /home/ubuntu/bin/access/prelim > /tmp/ittemp.html 
mv /tmp/ittemp.html /home/ubuntu/bin/access/it.html
rm /tmp/biglog 
