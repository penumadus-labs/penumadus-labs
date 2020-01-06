/* for parsing input string */
struct queryargs_t {
		char *tag;
		char *value;
};
int parseArgsHTML(struct queryargs_t *queryargs, int size_queryargs);
void dumpargs(struct queryargs_t *qptr,int numargs);
extern void g_err( char * errbuf, bool EXITSTAT, bool PERRNO);
extern unsigned char * stamp(void);
extern char *prefunc(const char *str1, char *str2); 
