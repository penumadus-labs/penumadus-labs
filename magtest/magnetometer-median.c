#include <stdio.h>
#include <sys/types.h>

//usually sys files then local files
#include "magnetometer-median.h"


#define LIST_SIZE 20000
#define MAXIMUM_MAGNITUDE 200

typedef u_int32_t list_size;
typedef u_int8_t value_size;

// actual data set of LIST_SIZE stored in order received
value_size magnetometer_data[LIST_SIZE];
value_size *insert_pointer = magnetometer_data;
// used to check for circling index pointer back around
const value_size *const list_end = magnetometer_data + LIST_SIZE;

// assumed that data values can only be 0 - MAXIMUM_MAGNITUDE
// data summary has a count of each value
list_size size = 0;
list_size data_summary[MAXIMUM_MAGNITUDE];

// only returns whole numbers, will floor of the result is .5
value_size get_median() {
  list_size total, *i, *j;
  total = 0;

  // ceil divide by 2
  const list_size median_index = (size + 1) >> 1;

  for (i = data_summary;; ++i) {
    total += *i;
    if (total >= median_index) { // needs to break before increment

      break;
    }
  }

  // if size is odd or median value not between two values
  if (size >> 1 < median_index || total > median_index) {
    return i - data_summary;
  }

  // find the index of the next hightest value
  for (j = i + 1; *j == 0; ++j)
    ;

  // add the two indexes and divide by two
  // floors decimal results
  return (i - data_summary + j - data_summary) >> 1;
}

value_size insert_magnetometer_data(const value_size data) {

  ++data_summary[data];

  if (size == LIST_SIZE) {
    // remove element from summary if it will be overwritten
    --data_summary[*insert_pointer];
  } else {
    ++size;
  }

  *insert_pointer = data;

  ++insert_pointer;

  if (insert_pointer == list_end) {
    insert_pointer = magnetometer_data;
  }

  return get_median();
}

void print_summary() {
  printf("\nsummary:\n");
  for (size_t i = 0; i < MAXIMUM_MAGNITUDE; ++i) {
    printf("%5d,%c", data_summary[i], (i + 1) % 20 != 0 ? ' ' : '\n');
  }
}

void print_data() {
  printf("\ndata:\n");
  for (size_t i = 0; i < LIST_SIZE; ++i) {
    printf("%3d,%c", magnetometer_data[i], (i + 1) % 50 != 0 ? ' ' : '\n');
  }
}

void print_median() { printf("\nmedian: %d\n", get_median()); }

int main() {
	size_t count;
	for(count=0;count<100;count++){
	  for (size_t i = 0; i < LIST_SIZE; ++i) {
		insert_magnetometer_data(i);
	  }
	}

  //print_data();
  print_median();
  print_summary();

  return 0;
}
