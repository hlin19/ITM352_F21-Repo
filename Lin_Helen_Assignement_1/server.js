//Starting code from Assignment 1 Instructions
var express = require("express");
var app = express();
var fs = require("fs");
var port = 8080;
var myParser = require("body-parser");

var products = require("./product.json"); //load in the products created in Products.json file
var quantityArray = ["0", "0", "0", "0", "0"]; //initialize array of quantity
app.use(myParser.urlencoded({ extended: true }));

// To send product data to the client side (code from lab 13 exercise 5)
app.get("/products.js", function (req, res, next) {
  res.type(`.js`);
  var products_str = `var products = ${JSON.stringify(products)};`;
  res.send(products_str);
});

// monitor all requests (Assignment 1 Instruction example)
app.all("", function (request, response, next) {
  console.log(request.method + " to " + request.path);
  next();
});

// Process purchase request (From Lab 13 Exercise 4)
// Process purchase request (From Lab13 Exercise 4)
app.post("/process_form", function (request, response) {
  let POST = request.body;

  for (i = 0; i < products.Milk_Tea.length; i++) {
    let quantity = POST[`quantity${i}`];
    if (quantity == undefined) {
      quantity = "0";
    } else if (!isNonNegativeInteger(quantity)) {
      response.send(`<h2>${quantity} is not a valid quantity!</h2>`);
      quantity = "0";
    } else if (quantity > 100) {
      response.send(`<h2>${quantity} is not available!</h2>`);
      quantity = "0";
    } else {
      quantityArray[i] = quantity;
      response.send(`<p>Item added to cart successfully!</p>`);
    }
  }

  console.log(quantityArray);
});

//Data validation (found in Lab 3 Exercise 5)
function isNonNegativeInteger(inputString, returnErrors = false) {
  // Validate that an input value is a non-negative integer
  // inputString is the input string; returnErrors indicates how the function returns: true means return the
  // array and false means return a boolean.

  errors = []; // assume no errors at first
  if (Number(inputString) != inputString) {
    errors.push("Not a number!"); // Check if string is a number value
  } else {
    if (inputString < 0) errors.push("Negative value!"); // Check if it is non-negative
    if (parseInt(inputString) != inputString) errors.push("Not an integer!"); // Check that it is an integer
  }
  return returnErrors ? errors : errors.length == 0;
}

//to send invoice data to client side (From Lab 13 Exercise 4)
app.get("/invoice.js", function (req, res, next) {
  res.type(`.js`);
  var products_str = `var quantityArray = ${JSON.stringify(quantityArray)};
                      var products = ${JSON.stringify(products)};`;
  res.send(products_str);
});

// route all other GET requests to files in public (Assignment 1 Instruction example)
app.use(express.static("./public"));

// start server (Assignment 1 Instruction example)
app.listen(port, () => console.log("listening on port " + port));
