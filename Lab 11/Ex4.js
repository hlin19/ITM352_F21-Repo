function convertTemperature(tempIn, units){
    //Function to convert temperatures from C to F and from F to C
    //tempin is the temperature you wish to convert in either units
    // units is either "C" or "F", the firection of the conversion

    if (units="F"){
        return (tempIn-32)*5/9;
    }else if (units == "C")
    {
        return tempIn*9/5+32;
    }else{
        return NaN;
    }
}
//console.log("100 C=",convertTemperature(100,"C"));
//console.log("212 F==", convertTemperature(212,"F"));

var attributes = "5; -3; 0; xxx; 7.5; 13";

var pieces = attributes.split(";")

function isNonNegInt(q, returnErrors= false){
    //validate that an input value is a non-negative integer 
    // q is the input string 
errors = []; // assume no errors at first
if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
return returnErrors ? errors : (errors.length == 0);
}

for (testVal in pieces){
    console.log(testval + ";"+ pieces[testval] +" "+ isNonNegInt(pieces[testVal],true));
}