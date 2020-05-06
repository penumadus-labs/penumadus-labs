typedef  struct lparse {
	unsigned char *request;
	bool (*func)(unsigned char *request);
	bool (*respfunc)(unsigned char *response, unsigned char *outgoing,
		 int outgoingsize, struct lparse *parseptr);
	char cmndcode;
	char subcode;
}parsetbl_t;


