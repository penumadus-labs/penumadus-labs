#/bin/bash
#200 is successful ones
cat /var/log/nginx/access.log > /tmp/it
cat /var/log/nginx/access.log >> /tmp/it
cat /var/log/nginx/access.log.>/dev/null | grep ' 200 ' >> /tmp/it
cat /var/log/nginx/access.log.>/dev/null | grep ' 206 ' >> /tmp/it
for i in 2 3 4 5 6 7 8 9 10
do
	gzip -d -c /var/log/nginx/access.log.$i 2>/dev/null >> /tmp/it
	gzip -d -c  /var/log/nginx/access.log.$i 2>/dev/null >> /tmp/it
done

cat /tmp/it | /home/ubuntu/bin/outpage
