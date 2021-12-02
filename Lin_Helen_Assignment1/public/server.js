var products_array = require("./Boba_Product.json"); //load in the products created in Boba_Products.json file
//this prints out "strawberry"
//console.log(products_array['Milk_Tea'][0]['name']);

var express = require("express");
var app = express();

// Routing
app.get("http://localhost:3001/Milk_Tea", function (req, res, next) {
  //res.write(`<h1>Hello World </h1>`);
  console.log(JSON.stringify(products_array));
  res.send(JSON.stringify(products_array));
});

// monitor all requests
app.all("*", function (request, response, next) {
  console.log(request.method + " to " + request.path);
  next();
});

// process purchase request (validate quantities, check quantity available)
// <** your code here ***>

// route all other GET requests to files in public
app.use(express.static("./public"));

// start server
app.listen(8080, () => console.log(`listening on port 8080`));
