# find ~/ -type d -name node_modules -exec rm -r {} +

cd ~/web
echo $PWD
rm -rf node_modules
npm i

cd client
echo $PWD
rm -rf node_modules
npm i

cd ../server
echo $PWD
rm -rf node_modules
npm i

cd ~/public
echo $PWD
rm -rf node_modules
npm i

