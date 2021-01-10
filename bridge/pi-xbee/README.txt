Usage: %s [ SerialPort ] [Server Address] [Server Port]

killall -SIGUSR1 trans   #toggles on/off additional debug info to logs
killall -SIGUSR2 trans   #toggles on/off remote data echos to logs (LOTS of data)

killall -SIGPIPE trans   #cleanup and terminate the process (shuts down modem and logs of cell net
killall -SIGTERM trans   #     .
killall -SIGINT trans    #     .
