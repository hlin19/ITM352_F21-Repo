//Starting code from Assignment 1 Instructions
var express = require("express");
var app = express();
var fs = require("fs");
var port = 3000;
var myParser = require("body-parser");

var products = require("./product.json"); //load in the products created in Products.json file

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
  let brand = products[0]["name"];
  let name_price = products[0]["price"];

  if (typeof POST["quantity_textbox"] != "undefined") {
    let quantity = POST["quantity_textbox"];
    if (isNonNegativeInteger(quantity)) {
      products[0]["total_sold"] += Number(quantity);
      response.send(
        `<H2>Thank you for ordering ${quantity} ${brand}! Your total is \$${
          quantity * name_price
        }.</H2>`
      );
    } else {
      response.send(`<I>${quantity} is not a valid quantity!</I>`);
    }
  }
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

// route all other GET requests to files in public
app.use(express.static("./public"));

// start server
app.listen(port, () => console.log("listening on port " + port));
