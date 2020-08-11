#!/bin/bash

wpa_cli -i wlan0 set_network $1 ssid '"'$2'"'

wpa_cli -i wlan0 set_network $1 psk '"'$3'"'

wpa_cli -i wlan0 select_network $1

