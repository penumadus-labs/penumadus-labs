# tankmon
Repository for all code related to tank monitoring 

make sure all development takes place in development branch!!

### Folders are laid out as follows:

- web: main server application - MERN stack
- DM: Data Monitoring code 
- Stub: code that bridges Hank and DM
- Hank: arduino code for tank module
- bin: misc. tools that live on the ASW server


### hank wifi interface
- currently available on http://192.168.4.1
- make sure sudoers file has the lines listed in sudoers.txt file under hank/hank_site
- make sure hank has wpa_cli installed
- user must be connected to hank_net to connect to site
- will not switch over if invalid wifi or pw is given

# nginx

nginx is the entry point of the server listening on port 80 & 443
a config file "https.conf" contains https configuration and a reverse proxy to port 8000 where the main application listens
the path of this file is:
/etc/nginx/conf.d/https.conf

nginx uses certbot for its https certs
to re-certify run "sudo certbot --nginx"
certbot should renew automatically

# mongo database
/etc/mongod.conf contains settings to allow connections from other ip addresses besides localhost
net: bindIp: 0.0.0.0 - allows the connection of any ip address
security: authorization: enabled - makes it so users musts have valid credentials to access the database


# nodejs

for the web:
the main application uses port 8000 for production
the development server uses ports 8080 and 3000

for devices:
the server listens on port 32100 to receive data from the field
