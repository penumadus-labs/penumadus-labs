for i in $(grep -E -o "([0-9]{1,3}[\.]){3}[0-9]{1,3}" /var/log/fail2ban.log)
do
	echo '*********************************'
	whois $i 2>/dev/null  | grep -v % | grep -v  \# | grep -v remarks | grep -v omment 

done

