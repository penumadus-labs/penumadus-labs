#!/bin/bash

grep -v ceecam /etc/hosts >/tmp/hosts

a=$(cat /home/ubuntu/camera/ip.txt)
echo "$a ceecam.edu" >>/tmp/hosts
sudo mv /tmp/hosts /etc/hosts
