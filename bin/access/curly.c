#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
 
#include <curl/curl.h>
 
static char urljson[1024];

static size_t write_data(void *ptr, size_t size, size_t nmemb, void *stream)
{
	strncat(urljson,ptr,size*nmemb);
	  return size*nmemb;
}
 
char *fetchAurl(char *ipaddr)
{
  CURL *curl_handle;
	char urlly[256];

	urljson[0]='\0';
 
  curl_global_init(CURL_GLOBAL_ALL);
 
  /* init the curl session */ 
  curl_handle = curl_easy_init();
 
	sprintf(urlly,"https://json.geoiplookup.io/%s",ipaddr);

  /* set URL to get here */ 
  curl_easy_setopt(curl_handle, CURLOPT_URL, urlly);
 
  /* Switch on full protocol/debug output while testing */ 
  //curl_easy_setopt(curl_handle, CURLOPT_VERBOSE, 1L);
  /* Switch on full protocol/debug output while testing */ 
  curl_easy_setopt(curl_handle, CURLOPT_VERBOSE, 0L);
 
  /* disable progress meter, set to 0L to enable it */ 
  curl_easy_setopt(curl_handle, CURLOPT_NOPROGRESS, 1L);
 
  /* send all data to this function  */ 
  curl_easy_setopt(curl_handle, CURLOPT_WRITEFUNCTION, write_data);
 
    /* get it! */ 
    curl_easy_perform(curl_handle);
 
  /* cleanup curl stuff */ 
  curl_easy_cleanup(curl_handle);
 
  curl_global_cleanup();
 
  return(urljson);
}

