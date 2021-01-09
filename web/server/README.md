add .env to root
LOCAL_SERVER - disabled communication with udpEngine
MODE - tank or bridge runtime mode
SERVER_IP - required for ini device configuration files
AUTH_DISABLED - will disallow authorization at runtime - disabled by default in development
EXCLUDED_UDP_PORTS - udpEngines not to start up in this environment separated by comma, no whitespace

add .env to ./database
DB_URL
DB_USER
DB_PWD
