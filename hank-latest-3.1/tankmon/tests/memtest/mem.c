#include <stdio.h>


char spbuf[256];

/*********   primitive heap manager routines ***********/

#define MEMALLOCATED 4096
#define MEMELEMENTDATASIZE 30


#define byte unsigned char
typedef byte elementindex;

/* singly linked list acting as a fifo, fwd is index of fwd element */
struct memelement {
		elementindex fwd;
		char buffer[MEMELEMENTDATASIZE];
};


/* cannot exceed 256 */
#define TOTALLISTELEMENTS MEMALLOCATED/sizeof(struct memelement)

struct memelement elements[TOTALLISTELEMENTS];

elementindex freelisthead;

struct elementlist {
		elementindex head;
		elementindex tail;;
		byte numelements;
};



void
memsetup(void){
	elementindex index;
	
	for(index=0;(index<TOTALLISTELEMENTS)&&(index<0xFF);index++){
		elements[index].fwd=index+1;
	}
	
	elements[index-1].fwd=0xFF;
	freelisthead=0;
}

void
dumpmem(void){
	elementindex index;
	printf("freelist head: %d\n",freelisthead);
	for(index=0;index<TOTALLISTELEMENTS;index++){
		sprintf(spbuf,"el:%03d fwd:%d ",index,elements[index].fwd);
		printf("%s\n",spbuf);
		//Serial.println(spbuf);
	}
}
	
elementindex
allocMemElement(){
	elementindex ret;
	if(freelisthead==0xFF){
		printf("Freelist Exhausted\n");
		//Serial.println("Freelist Exhausted\n");
		ret=0xFF;
	}
	else{
		ret=freelisthead;
		freelisthead=elements[freelisthead].fwd;
	} 
	return(ret); 
}

void
freeMemElement(elementindex index){
	elements[index].fwd=freelisthead;
	freelisthead=index;
}

		
void
initList(struct elementlist *list){
	list->head=0xFF;
	list->tail=0xFF;
	list->numelements=0;
}
		
byte
appendListToList(struct elementlist *list1,struct elementlist *list2){

	if(list1->head==0xFF){
		list1->head=list2->head;
		
	}
	else{
		elements[list1->tail].fwd=list2->head;
	}

	list1->tail=list2->tail;
	list1->numelements+=list2->numelements;
	initList(list2);

	return(list1->numelements);
}

byte
appendToList(struct elementlist *list,elementindex index){

	if(index == 0xFF){
		printf("Error in index # in append list\n");
		return(0);
	}

	/* empty list */
	if(list->head == 0xFF){
		list->head=index;
		list->tail=index;
		elements[index].fwd=0xFF;
	}
	else{
		elements[list->tail].fwd=index;
		list->tail=index;
		elements[list->tail].fwd=0xFF;
		list->numelements++;
	}
	return(list->numelements);
}

elementindex
removeFirstElement(struct elementlist *list){
	elementindex ret;
	ret=list->head;	
	if(list->head == 0xFF){ 
		list->tail=0xFF;
	}
	else{
		list->head=elements[list->head].fwd;
		list->numelements--;
	}
	return(ret);
}

void
printlist(struct elementlist *list){
	elementindex index;
	printf("Num Elems: %d head: %d  tail: %d\n",list->numelements,list->head,list->tail);
	//Serial.println("Num Elems: "+list.numelements);
	for(index=list->head;index != 0xFF; index=elements[index].fwd){
		sprintf(spbuf,"index %d  fwd: %d",index,elements[index].fwd);
		printf("%s == %s\n",spbuf,elements[index].buffer);
		//Serial.println(spbuf);
	}
}

void
fsck()
{
	elementindex index;
	int count;
	index=freelisthead;
	count=0;
	while(index != 0xFF){
		printf("%d->",index);
		index=elements[index].fwd;
		count++;
	}
	printf("Element count  %d\n",count);
}
int
main()
{
	elementindex index;
	printf("TOTAL ELEMENTS: %ld\n",TOTALLISTELEMENTS);
	memsetup();
	dumpmem();
	unsigned char i;

	struct elementlist periodData;
	initList(&periodData);
	struct elementlist accelData;
	initList(&accelData);

	printf("begin multi test \n");
	
	for(i='a';i<='j';i++){
		index=allocMemElement();	
		elements[index].buffer[0]=i;
		elements[index].buffer[1]='\0';
		appendtolist(&periodData,index);
	}
	printf("period list\n");
	printlist(&periodData);
	printf("accel list\n");
	printlist(&accelData);
	
	for(i='k';i<='z';i++){
		index=allocMemElement();	
		elements[index].buffer[0]=i;
		elements[index].buffer[1]='\0';
		appendtolist(&accelData,index);
	}
	printf("period list\n");
	printlist(&periodData);
	printf("accel list\n");
	printlist(&accelData);
	fsck();

	appendlisttolist(&periodData,&accelData);
	printf("period list\n");
	printlist(&periodData);
	printf("accel list\n");
	printlist(&accelData);
	fsck();

	while((index=removeFirstElement(&periodData))!= 0xFF){
		freeMemElement(index);
	}
	fsck();
	dumpmem();

}
		
