#!/bin/bash

sudo wpa_cli -iwlan0 set_network $1 ssid '"'$2'"'

sudo wpa_cli -iwlan0 set_network $1 psk '"'$3'"'


