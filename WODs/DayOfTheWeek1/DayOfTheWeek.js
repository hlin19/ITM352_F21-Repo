var Month = 'August';
var Day = 14;
var Year = 2000;

var step1 = Year
if(Month=='January'){
    year = Year-1
} else if (Month=='February'){
    Year = Year-1
} else {
    Year = Year
}
var step2 = step1 + parseInt(step1/4);
var step3 = step2 - parseInt(step1/100);
var step4 = step3 + parseInt(step1/400)
var step5 = step4 + Day;
monthkey= {
    January:	0,
    February:	3,
    March:	    2,
    April:	    5,
    May:	    0,
    June:	    3,
    July:	    5,
    August:	    1,
    September:	4,
    October:	6,
    November:	2,
    December:	4
}
var step6 = step5 + monthkey[Month];
var step7 = step6%7;
num_to_weekdays =[
'Sunday',
'Monday',	
'Tuesday',	
'Wednesday',	
'Thursday',	
'Friday',	
'Saturday',	
];

console.log(`I am born on ${Month} ${Day} , ${Year}, ${num_to_weekdays[step7]}. `);
