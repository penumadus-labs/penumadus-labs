/*
 * This file contains the protocol for sending data from web, through stub, to Hank.
 * The stub takes a key/value pair and formats a string with a single character at the front to denote the command and then sends to DM for parsing.
 * The letters in this file denote the header character and what that message means
 *
 * L: log - Add this message to the log file.
 * P: power - Soft power down. Close the SD card and power down the device.
 *
 * /
