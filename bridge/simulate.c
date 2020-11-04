#include <stdio.h>      /* for printf() and fprintf() */
#include <sys/socket.h> /* for socket(), connect(), sendto(), and recvfrom() */
#include <arpa/inet.h>  /* for sockaddr_in and inet_addr() */
#include <stdlib.h>     /* for atoi() and exit() */
#include <string.h>     /* for memset() */
#include <unistd.h>     /* for close() */
#include <signal.h>     /* for close() */
#include <bool.h>     /* for close() */
#include <trans.h>     /* for close() */

#define ECHOMAX 255     /* Longest string to echo */

float globx,globy,globz;


/* Interrupt_handler so that CTRL +C can be used to exit the program */
void 
interrupt_handler (int signum) {
	if(signum==SIGUSR1){
		globx=globy=globz=4.0;
		fprintf(stderr,"accel is 4\n");
	}
	else{
		globx=globy=globz=1.0;
		fprintf(stderr,"accel is 1\n");
	}
}

int main(int argc, char *argv[])
{
    int sock;                        /* Socket descriptor */
    struct sockaddr_in echoServAddr; /* Echo server address */
    struct sockaddr_in fromAddr;     /* Source address of echo */
    unsigned short echoServPort;     /* Echo server port */
    unsigned int fromSize;           /* In-out of address size for recvfrom() */
    char *servIP;                    /* IP address of server */
    char echoString[2048];                /* String to send to echo server */
    char echoBuffer[ECHOMAX+1];      /* Buffer for receiving echoed string */
    int echoStringLen;               /* Length of string to echo */
    int respStringLen;               /* Length of received response */
	unsigned long millis=0;
	int i;

    servIP = "127.0.0.1";           /* First arg: server IP address (dotted quad) */

        echoServPort = REM0PORT;  /* Use given port, if any */

signal (SIGUSR1, interrupt_handler);
signal (SIGUSR2, interrupt_handler);

    /* Create a datagram/UDP socket */
    if ((sock = socket(PF_INET, SOCK_DGRAM, IPPROTO_UDP)) < 0){
        fprintf(stderr,"socket() failed");
	exit(0);
	}

    /* Construct the server address structure */
    memset(&echoServAddr, 0, sizeof(echoServAddr));    /* Zero out structure */
    echoServAddr.sin_family = AF_INET;                 /* Internet addr family */
    echoServAddr.sin_addr.s_addr = inet_addr(servIP);  /* Server IP address */
    echoServAddr.sin_port   = htons(echoServPort);     /* Server port */

	globx=1.0;
	globx=1.0;
	globx=1.0;
while(true){
	echoStringLen=sprintf(echoString,
		"%lu %.4f %.4f %.4f %.4f %.4f %.4f %.4f %.4f %.4f\n",
		millis, globx,globy,globz,4.0,5.0,6.0,7.0,8.0,9.0);

    /* Send the string to the server */
    if (sendto(sock, echoString, echoStringLen, 0, (struct sockaddr *)
               &echoServAddr, sizeof(echoServAddr)) != echoStringLen){
        fprintf(stderr,"sendto() sent a different number of bytes than expected\n");
	exit(0);
    }

	usleep(200000);
	millis+=20;

}

}
