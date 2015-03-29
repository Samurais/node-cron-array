/**
 * cron patten to string array and backward.
 */

var _ = require('lodash');
var CronJob = require('cron').CronJob;

exports.patternToArray = function(pattern) {
    console.log(pattern);

}

exports.arrayToPattern = function(array) {
    var minute = array.minute,
        hour = array.hour,
        day = array.day,
        month = array.month,
        weekday = array.weekday;

    var group = [minute, hour, day, month, weekday];
    var length = group.length;

    /*
     * validate the group elements are all array,
     * and all the element in arrays are number.
     */
    var val = _.some(group, function(x) {
        if (_.isArray(x)) {
            var result = false;
            x.forEach(function(y) {
                if (!_.isNumber(parseInt(y)) || _.isNaN(parseInt(y))) {
                    result = true;
                }
            });
            return result;
        } else {
            return true;
        }
    });

    if (val) {
        throw new Error("Unsupported cron array format.");
    }

    /*
     * make sure all number element belong to
     * the same group is unique.
     */
    var uniqSortedGroup = [];
    for (var i = 0; i < length; i++) {
        var uniqed = _.uniq(group[i], true);
        var sorted = _.sortBy(uniqed, function(n) {
            return parseInt(n);
        });
        // console.log(_(sorted).toString());
        uniqSortedGroup.push(sorted);
    }

    /**
     * validate minute, hour, day of month, month of year, day of week.
     *
     */
    for (var j = 0; j < length; j++) {
        switch (j) {
            case 0:
                uniqSortedGroup[j].forEach(function(z) {
                    if (z < 0 || z > 59) {
                        console.error('>> validate minute.');
                        throw new Error('Unsupported minute format.')
                    }
                });
                break;
            case 1:
                uniqSortedGroup[j].forEach(function(z) {
                    if (z < 0 || z > 23) {
                        console.error('>> validate hour.');
                        throw new Error('Unsupported hour format.');
                    }
                });
                break;
            case 2:
                uniqSortedGroup[j].forEach(function(z) {
                    if (z < 1 || z > 31) {
                        console.error('>> validate day of month.');
                        throw new Error('Unsupported day format.');
                    }
                });
                break;
            case 3:
                uniqSortedGroup[j].forEach(function(z) {
                    if (z < 0 || z > 11) {
                        console.error('>> validate month of year.');
                        throw new Error('Unsupported month format.');
                    }
                });
                break;
            case 4:
                uniqSortedGroup[j].forEach(function(z) {
                    if (z < 0 || z > 6) {
                        console.error('>> validate day of week.');
                        throw new Error('Unsupported weekday format.');
                    }
                });
                break;
            default:
                break;
        }
    }

    /**
     * join pattern string
     */
    var cronJobTmp = [];
    for (var t = 0; t < length; t++) {
        cronJobTmp.push(_(uniqSortedGroup[t]).toString());
    }

    var cronJobPattern = cronJobTmp.join(' ');

    /**
     * validate patten with node-cron
     */
    try {
        new CronJob(cronJobPattern);
    } catch (ex) {
        throw new Error('Unsupported pattern format.');
    }

    return cronJobPattern;
}
