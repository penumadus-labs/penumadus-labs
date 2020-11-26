# db currently started from node
# sudo service mongod start

# start proxy server on port 80
sudo service nginx start

# start app on port 8000
pm2 start web/server