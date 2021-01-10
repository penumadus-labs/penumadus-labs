
#!/bin/bash
        #set -x

        #kill any old tunnels

        for i in `pidof autossh`
        do
                ps -p $i
                echo terminating $i
                kill -SIGINT $i
                sleep 4
        done

        user="ubuntu"
        options="-i /root/.ssh/tankmon.pem"
        aliveoptions="-o ExitOnForwardFailure=yes -o StrictHostKeyChecking=no -o CheckHostIP=no -o TCPKeepAlive"

        addr="hankthetank.me"


        autossh -M 0 -tt $options -R 20020:localhost:8081 $user@$addr &
	apid=$!
	autossh -M 0 -tt $options -R 20021:localhost:80 $user@$addr &
	bpid=$!
	autossh -M 0 -tt $options -R 20022:localhost:22 $user@$addr &
	cpid=$!

while true
do
	sleep 120

	ps | grep -v grep | grep $apid
	if [ $? -ne 0 ]
	then

	        autossh -M 0 -tt $options -R 20020:localhost:8081 $user@$addr &
		apid=$!
	fi
	ps | grep -v grep | grep $bpid
	if [ $? -ne 0 ]
	then

	        autossh -M 0 -tt $options -R 20021:localhost:80 $user@$addr &
		bpid=$!
	fi
	ps | grep -v grep |  grep $cpid
	if [ $? -ne 0 ]
	then

	        autossh -M 0 -tt $options -R 20022:localhost:22 $user@$addr &
		cpid=$!
	fi

done
