#/bin/bash
#200 is successful ones
cat /var/log/nginx/access.log | grep ' 200 ' > /tmp/it
cat /var/log/nginx/access.log | grep ' 206 ' >> /tmp/it
for i in 1 2 3 4 5 6 7 8 9 10
do
	cat /var/log/nginx/access.log.$i 2>/dev/null | grep ' 200 ' >> /tmp/it
	cat /var/log/nginx/access.log.$i 2>/dev/null | grep ' 206 ' >> /tmp/it
done

printf "\n**********Successful GET of bridge page in last two days **************\n"
printf "%18s %20s %20s %20s %10s %6s %6s\n" "ip" "last access" "city" "country" "connecton" "lat" "long" 
for i in `cat /tmp/it | grep --line-buffered compositebridgeaccess`
do 
	thisip=$(echo $i | cut -d' ' -f1) | sort -u`
	thisbrowse=$( echo $i | rev | cut -d'"'  -f2 | rev)
	echo ip $i
	b=$(curl https://json.geoiplookup.io/$i 2>/dev/null) 
	#echo $b
	ip=$(echo "$b" | grep ip | cut -d':' -f2|cut -d',' -f1)
	city=$(echo "$b" | grep city | cut -d':' -f2|cut -d',' -f1)
	country=$(echo "$b" | grep country_name | cut -d':' -f2|cut -d',' -f1)
	contype=$(echo "$b" | grep connection_type | cut -d':' -f2|cut -d',' -f1)
	lat=$(echo "$b" | grep latitude | cut -d':' -f2|cut -d',' -f1)
	long=$(echo "$b" | grep longitude | cut -d':' -f2|cut -d',' -f1)
	city=$(echo $city | cut -b1-20)

	k="0"
	L=/var/log/nginx/access.log
	grep $i $L > /tmp/last
	while true
	do
		when=$(tail -1 /tmp/last | cut -d' ' -f4 | cut -d']' -f1)]
		t=$(echo $when | cut -b1)
		if [ "$t" ==  "[" ]
		then
			break
		elif  ((k>10)) 
		then
			when="[no time]"
		else
			k=$(($k+1))
		fi
		grep $i $L.$k > /tmp/last
	done
	printf "%18s %20s %20s %20s %10s %6s %6s\n" "$ip" "$when" "$city" "$country" "$contype" "$lat" "$long"
done

printf "\n\n**********Successful GET of something at all**************\n"
printf "%18s %20s %20s %20s %10s %6s %6s\n" "ip" "last access" "city" "country" "connecton" "lat" "long" 
for i in `cat /tmp/it |  cut -d' ' -f1 | sort -u`
do
	b=$(curl https://json.geoiplookup.io/$i 2>/dev/null) 
	#echo $b
	ip=$(echo "$b" | grep ip | cut -d':' -f2|cut -d',' -f1)
	city=$(echo "$b" | grep city | cut -d':' -f2|cut -d',' -f1)
	country=$(echo "$b" | grep country_name | cut -d':' -f2|cut -d',' -f1)
	contype=$(echo "$b" | grep connection_type | cut -d':' -f2|cut -d',' -f1)
	lat=$(echo "$b" | grep latitude | cut -d':' -f2|cut -d',' -f1)
	long=$(echo "$b" | grep longitude | cut -d':' -f2|cut -d',' -f1)
	city=$(echo $city | cut -b1-20)

	k="0"
	L=/var/log/nginx/access.log
	grep $i $L > /tmp/last
	while true
	do
		when=$(tail -1 /tmp/last | cut -d' ' -f4 | cut -d']' -f1)]
		t=$(echo $when | cut -b1)
		if [ "$t" ==  "[" ]
		then
			break
		elif  ((k>10)) 
		then
			when="[no time]"
		else
			k=$(($k+1))
		fi
		grep $i $L.$k > /tmp/last
	done
	printf "%18s %20s %20s %20s %10s %6s %6s\n" "$ip" "$when" "$city" "$country" "$contype" "$lat" "$long"
done
