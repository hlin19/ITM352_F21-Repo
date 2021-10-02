require("./ProductsData.js");

var num_products = 5;

var count = 1; 

while (count <= num_products) {
    if (count > num_products/2){
        break;
    }
    console.log(`${count}. ${eval('name' + count)}`);
    count++;
}
console.log("That's enough!")

