//Starting code from Assignment 1 Instructions
var express = require("express");
var app = express();
var fs = require("fs");
var port = 3000;
var myParser = require("body-parser");

var products = require("./product.json"); //load in the products created in Products.json file
var quantityArray = ["0", "0", "0", "0", "0"]; //initialize array of quantity
app.use(myParser.urlencoded({ extended: true }));

// To send data to the client side (code from lab 13 exercise 5)
app.get("/products.js", function (req, res, next) {
  res.type(`.js`);
  var products_str = `var products = ${JSON.stringify(products)};`;
  res.send(products_str);
});

// monitor all requests
app.all("", function (request, response, next) {
  console.log(request.method + " to " + request.path);
  next();
});

// Process purchase request (From Lab13 Exercise 4)
app.post("/process_form", function (request, response) {
  let POST = request.body;
  let milk_tea = "Milk Tea";
  let quantity = 0;

  for (i = 0; i < products.Milk_Tea.length; i++) {
    if (POST[`quantity${i}`] == undefined) {
      POST[`quantity${i}`] = "0";
    } else {
      quantityArray[i] = POST[`quantity${i}`];
    }
  }
  console.log(quantityArray);
  response.send(`<p>Item added to cart successfully!</p>`);
});

app.get("/invoice.js", function (req, res, next) {
  res.type(`.js`);
  var products_str = `var quantityArray = ${JSON.stringify(quantityArray)};
                      var products = ${JSON.stringify(products)};`;
  res.send(products_str);
});

//Data validation (found in Lab 3 Exercise 5)
function isNonNegativeInteger(inputString, returnErrors = false) {
  errors = []; // assume no errors at first
  if (Number(inputString) != inputString) {
    errors.push("Not a number!"); // Check if string is a number value
  } else {
    if (inputString < 0) errors.push("Negative value!"); // Check if it is non-negative
    if (parseInt(inputString) != inputString) errors.push("Not an integer!"); // Check that it is an integer
  }
  return returnErrors ? errors : errors.length == 0;
}

// route all other GET requests to files in public
app.use(express.static("./public"));

// start server
app.listen(port, () => console.log("listening on port " + port));
