#!/bin/bash

echo THIS SETS UP A DUAL MODE AP+CLIENT NETWORK
set -x
set -e

#DO THESE AND REBOOT FIRST
#apt-get update
#apt-get upgrade
echo make sure you have apt-get update, apt-get upgrade, and rebooted
echo press enter to continue
read a

#get future packages before hosing networking 
apt install -d libnss-resolve hostapd

# deinstall classic networking
apt --autoremove purge ifupdown dhcpcd5 isc-dhcp-client isc-dhcp-common rsyslog
apt-mark hold ifupdown dhcpcd5 isc-dhcp-client isc-dhcp-common rsyslog raspberrypi-net-mods openresolv
rm -rf /etc/network /etc/dhcp

# setup/enable systemd-resolved and systemd-networkd
apt --autoremove purge avahi-daemon
apt-mark hold avahi-daemon libnss-mdns
apt install libnss-resolve
ln -sf /run/systemd/resolve/stub-resolv.conf /etc/resolv.conf
systemctl enable systemd-networkd.service systemd-resolved.service

#networkd setup finished

apt install hostapd

systemctl unmask hostapd.service
systemctl enable hostapd.service


cat > /etc/hostapd/hostapd.conf <<EOF
interface=ap0
driver=nl80211
ssid=hanknet
country_code=US
hw_mode=g
channel=1
auth_algs=1
wpa=2
wpa_passphrase=hankthetank
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
EOF

chmod 600 /etc/hostapd/hostapd.conf

#---------
#fix the hostapd file
a=$(tempfile -d /tmp)

e=$(tempfile -d /tmp)
chmod +x $e
cat >> $e <<EOF
cat \$1 | sed "s/^After=network.target/#After=network.target/" > $a
cat $a > \$1
EOF

export EDITOR=$e
systemctl --full edit hostapd.service
#----------


#fix the overrides file for hostapd.service.d
c=$(tempfile -d /tmp)
cat >>$c <<EOF
[Unit]
Wants=wpa_supplicant@wlan0.service

[Service]
Restart=
Restart=no
ExecStartPre=/sbin/iw dev wlan0 interface add ap0 type __ap
ExecStopPost=-/sbin/iw dev ap0 del
EOF

b=$(tempfile -d /tmp)
chmod +x $b
cat >> $b <<EOF
cat $c > \$1
EOF
cat $c
cat $b

export EDITOR=$b
systemctl edit hostapd.service

#fix wpa_supplicant
cat >/etc/wpa_supplicant/wpa_supplicant-wlan0.conf << EOF
country=US
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
	ssid="SCADA"
	psk="notsaranwrap"
	key_mgmt=WPA-PSK
}
EOF

chmod 600 /etc/wpa_supplicant/wpa_supplicant-wlan0.conf
systemctl disable wpa_supplicant.service
systemctl enable wpa_supplicant@wlan0.service
rfkill unblock 0
rfkill unblock wlan

#fix the wpa supplicant service file 
c=$(tempfile -d /tmp)
cat >>$c <<EOF
[Unit]
BindsTo=hostapd.service
After=hostapd.service
EOF

b=$(tempfile -d /tmp)
chmod +x $b
cat >> $b <<EOF
cat $c > \$1
EOF
cat $c
cat $b

export EDITOR=$b
systemctl edit wpa_supplicant@wlan0.service

#setup interfaces for client
cat > /etc/systemd/network/08-wlan0.network << EOF
[Match]
Name=wlan0
[Network]
DNSSEC=no
DHCP=yes
EOF


#setup network for AP
cat > /etc/systemd/network/12-ap0.network <<EOF
[Match]
Name=ap0
[Network]
DNSSEC=no
IPMasquerade=yes
Address=192.168.4.1/24
DHCPServer=yes
[DHCPServer]
DNS=1.1.1.1 8.8.8.8 
EOF

