/*********   primitive heap manager routines ***********/

/*  only needed cause of pitiful RAM on the at2650  so have
 *  to share between users which is ugly
 */

/* memory array elements is divided up into fixed length segments 
 * composed of a byte index fwd pointer and data
 * the byte index is used like a poor mans pointer (elementindex)
 * into the array.  real pointers would take up too much room
 * so pray for a good optimizer to use adds of fixed elements rather than
 * multiplies to deref indicies
 * lists are appended to at the end and removed from the front so its a FIFO
 */

#ifdef CMNT
/* declared above at first of file till we can move to a class */
/* here is all the memory divided up into list elements */
struct memelement elements[TOTALLISTELEMENTS];

elementindex freelisthead;	//head of free element list, initiall all of memory
elementindex freelistcount;	//count of items on freelist 
#endif

/* must be called once before using any of the list or mem alloc routines */
void
memsetup(void){
	elementindex index;
	
	for(index=0;(index<TOTALLISTELEMENTS)&&(index<0xFF);index++){
		elements[index].fwd=index+1;
	}
	
	elements[index-1].fwd=0xFF;
	freelisthead=0;
	freelistcount=index;
	//PONDSCUM TEST
	ofreelistcount=index;

	Serial.print(F("TOTAL ELEMENTS: "));
	Serial.println(TOTALLISTELEMENTS);
	Serial.print(F("HIGHWATER: "));
	Serial.println(FREELISTHIGHWATER);
}

/* debug routine to dump memory */
void
dumpmem(void){
	elementindex index;
	Serial.print(F("freelist head:"));
	Serial.println(freelisthead);
	for(index=0;index<TOTALLISTELEMENTS;index++){
		sprintf(spbuf,"el:%03d fwd:%d ",index,elements[index].fwd);
		Serial.println(spbuf);
	}
}
	

/* allocate a memory buffer from freelist to me.  not on a list yet! 
 * just hanging in free space.  don't lose it.
 * make sure and check return value from this routine in case memory is all gone
 */
elementindex
allocMemElement(){

	elementindex ret;
	
	/* out of memory buffers */
	if(freelisthead==0xFF){
		Serial.println(F("Freelist Exhausted\n"));
		ret=0xFF;
	}
	else{
		ret=freelisthead;
		freelisthead=elements[freelisthead].fwd;
		freelistcount--;
	} 
	return(ret); 
}

/* return an element to the freelist.  make sure its not on any other list
 * before calling this or chaos will ensue
 */
void
freeMemElement(elementindex index){

	elements[index].fwd=freelisthead;
	freelisthead=index;
	freelistcount++;

		
}

		
/* initialize one of many possible user defined lists 
 * call once for each list name before using them
 */
void
initList(struct elementlist *list){
	list->head=0xFF;
	list->tail=0xFF;
	list->numelements=0;
}
		
/* append one entire list to another entire list */
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

/* add one element gotten from alloc to a list 
 * put whatever data you want in the buffer section of the element
 */
byte
appendToList(struct elementlist *list,elementindex index){

	if(index == 0xFF){
		Serial.println(F("Error in index # in append list"));
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
		elements[index].fwd=0xFF;
	}
	list->numelements++;
	return(list->numelements);
}

/* pull the first element off of the list and return it to us.
 * once again,  the buffer is hanging out in free space not on any
 * list so make sure to free it or append it somewhere or it will get lost 
 */
elementindex
removeFirstElement(struct elementlist *list){
	elementindex ret;
	ret=list->head;	
	if(list->head != 0xFF){ 
		list->head=elements[list->head].fwd;
		list->numelements--;
	}
	return(ret);
}

/* debug,   print a list */
void
printlist(struct elementlist *list){
	elementindex index;
	sprintf(spbuf,"Num Elems: %d head: %d  tail: %d\n",list->numelements,list->head,list->tail);
	Serial.println(spbuf);
	for(index=list->head;index != 0xFF; index=elements[index].fwd){
		sprintf(spbuf,"index %d  fwd: %d",index,elements[index].fwd);
		Serial.println(spbuf);
	}
}

/* debug,  check the freelist and make sure all the elements are there */
void
fsck()
{
	elementindex index;
	int count;
	index=freelisthead;
	count=0;
	while(index != 0xFF){
		sprintf(spbuf,"%d->",index);
		Serial.print(spbuf);
		index=elements[index].fwd;
		count++;
	}
	Serial.print(F("Element count: "));
	Serial.println(count);
}

