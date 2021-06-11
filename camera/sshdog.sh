#!/bin/bash
ssh=$(netstat -na | grep :22 | wc -l)
date=$(date)

echo "$date: $ssh sessions active" >> /home/ubuntu/logs/sessions.log


