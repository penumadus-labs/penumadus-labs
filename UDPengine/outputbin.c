#include <stdio.h>
#include <string.h>
#define LINES 4
#define LINESIZE 80

void outit(char **line);

void
outputBin(unsigned char *binstr, int dumplen)
{
char *cptr,*bptr;
int i,j,offset;
char teststr[]="2345\n";
char *line[LINES];
char buf[LINES*LINESIZE];

	printf("----------------------------------------\n");
	memset(buf, ' ', sizeof(buf) );
	for(i=0;i<LINES;i++){
		line[i]=buf+(i*80);
	}
	

	offset=0;
	j=0;
	while(j<dumplen){
		unsigned char tbit;
		sprintf(line[0]+offset,"    %02d",j);
		for(tbit=0x80,i=0;i<8;i++){
			if( (tbit & (*(binstr+j))) > 0)
				*(line[1]+offset+i)='1';
			else
				*(line[1]+offset+i)='0';
			tbit=tbit >> 1;
		}
		sprintf(line[2]+offset,"   0x%02x",(*(binstr+j)));

		if( (*(binstr+j) > 20) && (*(binstr+j) < 128) )
				sprintf(line[3]+offset,"    %c   ",*(binstr+j));
			else
				sprintf(line[3]+offset,"    -   ");

		if( (((j+1)%8) == 0) ){
			outit(line);
			offset=0;
			memset(buf, ' ', sizeof(buf) );
		}
		else
			offset+=10;
		j++;
	
	}
	outit(line);
	fflush(stdout);
	fflush(stderr);

}


void 
outit(char **line)
{
	int i,k;
	for(i=0;i<4;i++){
		for(k=0;k<LINESIZE;k++){
			putchar(*(line[i]+k));
		}
		putchar('\n');
	}
}
