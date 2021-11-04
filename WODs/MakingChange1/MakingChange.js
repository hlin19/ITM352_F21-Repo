var change = 169
var quarters = 25
var dimes = 10
var nickels = 5
var pennies = 1

step1= parseInt(change/quarters)        //max amount of quarters in change
step2= change%quarters                 // leftovers after quarters
step3= parseInt(step2/dimes)          //max amount of dimes in leftovers
step4= step2%dimes                   // leftovers of quarters + dimes
step5= parseInt(step4/nickels)      // max amount of nickels in leftovers of quarters + dimes
step6= step4%nickels               // leftovers of quarter+dimes+nickels 
step7= parseInt(step6/pennies)     // amount of pennies in leftovers of quarter+dimes+nickels

console.log(`The combo that makes the fewest coins for ${change} is ${step1} quarters, ${step3} dimes, ${step5} nickels, and ${step7} pennies.`)