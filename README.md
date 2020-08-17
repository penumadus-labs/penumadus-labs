# tankmon
Repository for all code related to tank monitoring 

make sure all development takes place in development branch!!

### Folders are laid out as follows:

- web-stack: nodejs client and server
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
