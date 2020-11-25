#!/bin/bash
	#set -x

	#kill any old tunnels
	for i in `ps -C autossh -o pid=`
	do
		ps -p $i
		echo terminating $i
		kill -SIGINT $i
		sleep 4
	done


	fulldebug="-v -v -v "
	debug=""

	options="-g -i /home/pi/.ssh/postapocalypse.pem -f -T -N"

	aliveoptions="-o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -o CheckHostIP=no -o TCPKeepAlive=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3"

	addr=hankthetank.me
	port=32170
	user="ubuntu"

	echo autossh -M 0 $debug $options $aliveoptions -R *:$sshport:localhost:22 $user@$addr
		autossh -M 0 $debug $options $aliveoptions -R *:32170:localhost:22 $user@$addr
	
