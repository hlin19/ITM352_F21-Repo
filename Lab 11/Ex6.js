// Callback function to check whether array elements are non-negative integers 
function checkIt(elem,index){
    console.log(`${index}:${elem} is ${(isNonNegInt(elem) ? 'a':'not a')} valid quantity`);

}

// apply checkit in pieces array 
pieces.forEach(checkIt);