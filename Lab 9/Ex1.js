// Ex1

var Month = 8;
var Day = 14;
var Year = "2000";

var step1 = Number(Year[2]+Year[3]);
var step2 = parseInt(step1/4);
var step3 = step2 + step1;
var step4 = 2; // July Mod # = 2
var step5 = step4 + step3;
var step6 = step5 + Day;
var step7 = step6 - 1;
var step8 = step7%7;

console.log(step1);
console.log(step2);
console.log(step3);
console.log(step4);
console.log(step5);
console.log(step6);
console.log(step7);
console.log(step8);

