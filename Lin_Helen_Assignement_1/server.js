//Starting code from Assignment 1 Instructions
var express = require("express");
var app = express();
var fs = require("fs");
var port = 3000;
var myParser = require("body-parser");

var products = require("./product.json"); //load in the products created in Products.json file

app.use(myParser.urlencoded({ extended: true }));

// To send data to the client side (code from lab 13 exercise 5)
app.get("/product_data.js", function (req, res, next) {
  res.type(`.js`);
  var products_str = `var products = ${JSON.stringify(products)};`;
  res.send(products_str);
});

// monitor all requests
app.all("", function (request, response, next) {
  console.log(request.method + " to " + request.path);
  next();
});

// process purchase request (validate quantities, check quantity available)
// < your code here >

// route all other GET requests to files in public
app.use(express.static("./public"));

// start server
app.listen(port, () => console.log("listening on port " + port));
