#!/bin/bash

sudo iwlist scanning | grep SSID > /var/www/html/cgi-bin/wifi_list.txt

