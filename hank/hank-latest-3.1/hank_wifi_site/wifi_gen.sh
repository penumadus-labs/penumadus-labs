#!/bin/bash

touch wifi_list.txt
sudo iwlist scanning | grep SSID > wifi_list.txt

