/*
<table id="myTable2">
<tr>
<!--When a header is clicked, run the sortTable function, with a parameter,
0 for sorting by names, 1 for sorting by country: -->
<th onclick="sortTable(0)">Name</th>
<th onclick="sortTable(1)">Country</th>
</tr>
...
*/

char *myheader="\n\
<script>\n\
window.onload=initsort;\n\
\n\
function initsort(){\n\
	sortTable(5);\n\
	sortTable(5);\n\
	sortTable(9);\n\
	sortTable(9);\n\
}\n\
\n\
function sortTable(n) {\n\
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;\n\
  table = document.getElementById(\"myTable2\");\n\
  switching = true;\n\
  // Set the sorting direction to ascending:\n\
  dir = \"asc\";\n\
  /* Make a loop that will continue until\n\
  no switching has been done: */\n\
  while (switching) {\n\
    // Start by saying: no switching is done:\n\
    switching = false;\n\
    rows = table.rows;\n\
    /* Loop through all table rows (except the\n\
    first, which contains table headers): */\n\
    for (i = 1; i < (rows.length - 1); i++) {\n\
      // Start by saying there should be no switching:\n\
      shouldSwitch = false;\n\
      /* Get the two elements you want to compare,\n\
      one from current row and one from the next: */\n\
      x = rows[i].getElementsByTagName(\"TD\")[n];\n\
      y = rows[i + 1].getElementsByTagName(\"TD\")[n];\n\
      /* Check if the two rows should switch place,\n\
      based on the direction, asc or desc: */\n\
      if (dir == \"asc\") {\n\
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {\n\
          // If so, mark as a switch and break the loop:\n\
          shouldSwitch = true;\n\
          break;\n\
        }\n\
      } else if (dir == \"desc\") {\n\
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {\n\
          // If so, mark as a switch and break the loop:\n\
          shouldSwitch = true;\n\
          break;\n\
        }\n\
      }\n\
    }\n\
    if (shouldSwitch) {\n\
      /* If a switch has been marked, make the switch\n\
      and mark that a switch has been done: */\n\
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);\n\
      switching = true;\n\
      // Each time a switch is done, increase this count by 1:\n\
      switchcount ++;\n\
    } else {\n\
      /* If no switching has been done AND the direction is \"asc\",\n\
      set the direction to \"desc\" and run the while loop again. */\n\
      if (switchcount == 0 && dir == \"asc\") {\n\
        dir = \"desc\";\n\
        switching = true;\n\
      }\n\
    }\n\
  }\n\
}\n\
</script>\n\
";
