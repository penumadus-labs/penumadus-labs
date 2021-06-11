#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <arpa/inet.h>

	struct entry {
		struct entry *fwd;
		struct sockaddr_in ip;	//space after
		char ident[8];	//space after
		char userid[24];	//space after
		char when[32]; //[] enclosed
		//char *cmnd;    //"  then "
		int result;    // space
		int size;    // space
		//char *referrer; //" then "
		char *useragent;
		int accesscount;
	};
		
struct entry * findit(struct entry *tmp, struct entry *root);
void printit(struct entry *tmp);
char * myindex(char *str, char delim);
char *fetchAurl(char *ipaddress);
char * getvalue(char *json, char *token);
extern char *myheader;

int uidrops=0;

int
main(int argc, char *argv[])
{

	char lbuf[512];
	struct entry *root;
	struct entry *tmp;
	struct entry *toot;
	char *parse,*bparse;
	struct sockaddr_in tmp_ip;	//space after
	int uniqueentries=0;
	int totalentries=0;
	int len;

	tmp_ip.sin_family=AF_INET;


	root=NULL;
	tmp=malloc(sizeof(struct entry));
	tmp->accesscount=1;
	while(fgets(lbuf,512,stdin) != NULL){
		totalentries++;
		//fprintf(stderr,"lbuf:[%s]\n",lbuf);
		parse=myindex(lbuf,' ');
		if(parse==NULL)
			continue;

		inet_aton(lbuf,&(tmp->ip.sin_addr));
		//fprintf(stderr,"as int %ld\n",(unsigned long)tmp->ip.sin_addr.s_addr);
		//get rid of ident
		parse=myindex(parse,' ');
		if(parse==NULL)
			continue;
		//get user
		bparse=parse;
		parse=myindex(parse,' ');
		if(parse==NULL)
			continue;
		strcpy(tmp->userid,bparse);
		
		//get when
		bparse=parse;
		parse=myindex(parse,']');
		if(parse==NULL)
			continue;
		strcpy(tmp->when,bparse);
		strcat(tmp->when,"]");

		//drop commnd
		parse=myindex(parse,'"');
		if(parse==NULL)
			continue;
		parse=myindex(parse,'"');
		if(parse==NULL)
			continue;

		//get result
		parse++;  //get past space
		bparse=parse;
		parse=myindex(parse,' ');
		if(parse==NULL)
			continue;
		sscanf(bparse,"%d",&(tmp->result));
		if( (tmp->result != 200) && (tmp->result != 206) )
			continue;

		
		//get size
		bparse=parse;
		parse=myindex(parse,' ');
		if(parse==NULL)
			continue;
		sscanf(bparse,"%d",&(tmp->size));

		//drop referrer
		bparse=parse;
		parse=myindex(parse,'"');
		if(parse==NULL)
			continue;
		parse=myindex(parse,'"');
		if(parse==NULL)
			continue;

		//rest is browser info
		len=strlen(parse)+1;
		tmp->useragent=malloc(len);
		strncpy(tmp->useragent,parse,len);
		//printit(tmp);

		if((toot=findit(tmp,root)) == NULL){
			tmp->fwd=root;
			root=tmp;
			tmp=malloc(sizeof(struct entry));
			tmp->accesscount=1;
			uniqueentries++;
		}
		else{
			strcpy(toot->when,tmp->when);
			toot->accesscount++;
		}

	}

	fprintf(stderr,"unique/total: %d/%d - ui:%d\n",uniqueentries,totalentries,uidrops);

	{
	int i=0;
	printf("<HTML>\n<HEAD>\n");
	printf(" <meta http-equiv=\"Content-Type\" content=\"text/html; charset=utf-8\"/>\n");
	printf("<style>\n");
	printf("table, th, td{ \nborder: 1px solid black; text-align:center;}\n</style>\n");
	printf("%s\n",myheader);
	printf("</HEAD><BODY>\n");
	printf("<H1 style=\"text-align:center;font-size:x-large;color:red\">Successful Accesses in last 4 days</H1>");
	printf("<H1 style=\"text-align:center;font-size:large;color:red;font-style:italic;\">click column headers to sort by column</H1>");
	printf("<table id=\"myTable2\" style=\"width:100%%;\">\n");
	printf("<tr><th onclick=\"sortTable(0)\" >#access</th><th onclick=\"sortTable(1)\" >ip</th><th onclick=\"sortTable(2)\" >Date</th><th onclick=\"sortTable(3)\" >Time</th><th onclick=\"sortTable(4)\" >city</th><th onclick=\"sortTable(5)\">  country</th><th onclick=\"sortTable(6)\" >isp</th><th onclick=\"sortTable(7)\" >net type</th><th onclick=\"sortTable(8)\" >result</th><th onclick=\"sortTable(9)\" >user id</th></tr>");
	tmp=root;
	while(tmp != NULL){
		if(strcmp(tmp->userid,"compositebridgeaccess") == 0)
			printf("<TR style=\"background-color:yellow;\" >\n");
		else
			printf("<TR >\n");
		printit(tmp);
		printf("</TR>\n");
		tmp=tmp->fwd;
	}
	printf("</table></BODY></HTML>");
	}
		


}

char *
getvalue(char *json, char *token)
{
	static char value[128];
	char *loc,eloc;;
	int i;
	strcpy(value,"-");
	if((loc=strstr(json,token)) != NULL){

		//find the :
		for(;*loc != ':';loc++){
			if(*loc == '\0')
				return(value);
		}
		//find the "
		for(;*loc != '"';loc++){
			if(*loc == '\0')
				return(value);
		}
		loc++;
		for(i=0;*(loc+i) != '"';i++){
			if(*(loc+i) == '\0'){
				strcpy(value,"-");
				return(value);
			}
			else
				value[i]=*(loc+i);
		}
		value[i]='\0';
	}
	return(value);
}

		
		
	



struct entry * 
findit(struct entry *tmp, struct entry *root)
{
	struct entry *toot;

	if(root==NULL)
		root=tmp;

	for(toot=root;toot->fwd != NULL; toot=toot->fwd){
		if( (toot->ip.sin_addr.s_addr == tmp->ip.sin_addr.s_addr)
		    && (strcmp(toot->useragent,tmp->useragent) == 0) )
		{
			return(toot);
			/*if(strcmp(toot->userid,tmp->userid)== 0)
				return(toot);
			else{
				fprintf(stderr,"uidrop\n");
				printit(tmp);
				printit(toot);
				uidrops++;
			}
			*/
		}
	}
	return(NULL);
}


void
printit(struct entry *tmp)
{

	static int i=1;
	char *jsoninfo,*valueptr;

	jsoninfo=fetchAurl(inet_ntoa(tmp->ip.sin_addr));
	//printf("<td>%d</td>\n",i);
	i++;
	printf("<td>%d</td>\n",tmp->accesscount);
	printf("<td>%s</td>\n",inet_ntoa(tmp->ip.sin_addr));
	printf("<td>%.11s</td><td>%.8s</td>\n",tmp->when+1,tmp->when+13);

	valueptr=getvalue(jsoninfo,"city");
	printf("<td>%s</td>\n",valueptr);
	valueptr=getvalue(jsoninfo,"country_name");
	printf("<td>%s</td>\n",valueptr);
	valueptr=getvalue(jsoninfo,"isp");
	printf("<td>%s</td>\n",valueptr);
	valueptr=getvalue(jsoninfo,"connection_type");
	printf("<td>%s</td>\n",valueptr);
	//valueptr=getvalue(jsoninfo,"latitude");
	//printf("<td>%s</td>\n",valueptr);
	//valueptr=getvalue(jsoninfo,"longitude");
	//printf("<td>%s</td>\n",valueptr);
	printf("<td>%d</td>\n",tmp->result);
	printf("<td>%s</td>\n",tmp->userid);
	//printf("<td>%d</td>\n",tmp->size);
	//printf("useragent:%s\n",tmp->useragent);
	
}
		
char *
myindex(char *str, char delim)
{
	char *bstr;
	bstr=str;
	while (*str != '\0'){
		if(*str == delim ){
			*str++ ='\0';
			return(str);
		}
		else
			str++;
	}

	fprintf(stderr,"Badly formed line delim: %c str: %s\n",delim,bstr);
	return(NULL);
}
