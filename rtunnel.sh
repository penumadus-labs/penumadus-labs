#!/bin/bash
	#set -x

	user="ubuntu"
	addr="hankthetank.me"
	sshport=32171
	keyfile="./aws.pem"

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

	options="-g -i $keyfile  -f -T -N"
	aliveoptions="-o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -o CheckHostIP=no -o TCPKeepAlive=yes -o ServerAliveInterval=30 -o ServerAliveCountMax=3"

	echo autossh -M 0 $debug $options $aliveoptions -R *:$sshport:localhost:22 $user@$addr
		autossh -M 0 $debug $options $aliveoptions -R *:$sshport:localhost:22 $user@$addr
	
