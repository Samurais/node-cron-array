# node-cron-array

Made a sample node_module to parse cron pattern to string array and reverse.

## validate array numbers

* all elements should be int.
* all elements should belong to the valid value buffer. 

## Number ranges

When specifying your cron values you'll need to make sure that your values fall within the ranges. For instance, some cron's use a 0-7 range for the day of week where both 0 and 7 represent Sunday. We do not.

* Seconds: 0-59
* Minutes: 0-59
* Hours: 0-23
* Day of Month: 1-31
* Months: 0-11
* Day of Week: 0-6
