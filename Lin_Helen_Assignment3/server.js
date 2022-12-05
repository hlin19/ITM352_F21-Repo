//loading packages and initialize variables
var express = require("express");
var app = express();
var fs = require("fs");
var port = 8080;
var myParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var filename = "./user_data.json";
var queryString = require("query-string");

//add for RRT
var mysql = require('mysql');
console.log("Connecting to localhost...");
var con = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    port: 3306,
    database: "RRT",
    password: ""
});

var products = require("./product.json"); //load in the products created in Products.json file
var quantityArray = ["0", "0", "0", "0", "0"]; //initialize array of quantity
var currentUser = "";

app.use(
    session({ secret: "MySecretKey", resave: true, saveUninitialized: true })
);
app.use(cookieParser());
app.use(myParser.urlencoded({ extended: true }));

if (fs.existsSync(filename)) {
    data = fs.readFileSync(filename, "utf-8");

    user_data = JSON.parse(data);
    console.log("User_data=", user_data);

    fileStats = fs.statSync(filename);
    console.log("File " + filename + " has " + fileStats.size + " characters");
} else {
    console.log("Enter the correct filename bozo!");
}

app.post("/login", function(request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    console.log("Got a POST to login");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    console.log("User name=" + user_name + " password=" + user_pass);

    if (user_pass != undefined) {
        if (user_pass == "admin") {
            //redirect to home page if getting a good login
            // currentUser = user_name; //store user_name to currentUser and pass to product.js
            // response.cookie("username", currentUser);
            response.redirect("/queries.html");
        } else if (user_pass == "customer") {
            //redirect to home page if getting a good login
            // currentUser = user_name; //store user_name to currentUser and pass to product.js
            // response.cookie("username", currentUser);
            response.redirect("/dashboard.html");
        } else {
            // Bad login, redirect
            response.redirect("/");
        }
    } else {
        // Bad username
        response.redirect("/");
    }
});

app.get("/register", function(request, response) {
    // Give a simple register form
    // register form found on w3school template
    str = `
 
  <html>
  <title>Register Account</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
  <body>
  
  <form action="/register" method="POST">
  <h2 class="w3-center">Sign Up Now!</h2>
   
  <div class="w3-row w3-section">
    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-user"></i></div>
      <div class="w3-rest">
        <input class="w3-input w3-border" name="username" type="text" placeholder="Username">
      </div>
  </div>
  
  <div class="w3-row w3-section">
    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-envelope-o"></i></div>
      <div class="w3-rest">
        <input class="w3-input w3-border" name="email" type="text" placeholder="Email">
      </div>
  </div>
  
  <div class="w3-row w3-section">
    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-pencil"></i></div>
      <div class="w3-rest">
        <input class="w3-input w3-border" name="password" type="text" placeholder="Enter Password">
      </div>
  </div>
  
  <div class="w3-row w3-section">
    <div class="w3-col" style="width:50px"><i class="w3-xxlarge fa fa-pencil"></i></div>
      <div class="w3-rest">
        <input class="w3-input w3-border" name="Enter Password Again" type="text" placeholder="Enter Password Again">
      </div>
  </div>
  
  <p class="w3-center">
  <button class="w3-button w3-section w3-blue w3-ripple"> Register </button>
  </p>
  </form>
  
  </body>
  </html> 
    `;
    response.send(str);
});

app.post("/register", function(request, response) {
    // process a simple register form
    console.log("Got a POST to register");
    POST = request.body;

    user_name = POST["username"];
    user_pass = POST["password"];
    user_email = POST["email"];
    currentUser = user_name;
    console.log("User name=" + user_name + " password=" + user_pass);

    //make sure users are not duplicated
    if (user_data[user_name] != undefined) {
        //redirect user to login if they had an account
        if (user_data[user_name].password == user_pass) {
            console.log("account exists in the file");
            response.redirect("/register");
        } else {
            console.log("account with this username has been created");
            response.redirect("/register");
        }
    } else {
        //add user to user_data object if the user hasn't create an account before
        user_data[user_name] = {};
        user_data[user_name].name = user_name;
        user_data[user_name].password = user_pass;
        user_data[user_name].email = user_email;

        //write back to user_data.json
        data = JSON.stringify(user_data);
        fs.writeFileSync(filename, data, "utf-8");

        response.send("User " + user_name + " added!");
        response.redirect("/login");
    }
});

// To send product data to the client side (code from lab 13 exercise 5)
app.get("/products.js", function(req, res, next) {
    res.type(`.js`);
    var str = `var products = ${JSON.stringify(products)};`;

    res.send(str);
});

// monitor all requests (Assignment 1 Instruction example)
app.all("", function(request, response, next) {
    console.log(request.method + " to " + request.path);
    next();
});

// Process purchase request (From Lab 13 Exercise 4)
// Process purchase request (From Lab13 Exercise 4)
app.post("/process_form", function(request, response) {
    let POST = request.body;
    request.session.order_array = [];
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

            for (i = 0; i < products.Milk_Tea.length; i++) {
                request.session.order_array[i] = quantityArray[i];
            }

            response.redirect("/cart.html");
        }

        console.log(request.session["order_array"]);
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

//to send invoice data to client side (From Lab 13 Exercise 4)
app.get("/cart.js", function(req, res, next) {
    res.type(`.js`);
    var orderArray = req.session.order_array;
    var username = req.cookies["username"];
    var products_str = `var quantityArray = ${JSON.stringify(orderArray)};
                      var products = ${JSON.stringify(products)};
                      var currentUser = "${username}"; `;
    res.send(products_str);
});

// route all other GET requests to files in public (Assignment 1 Instruction example)
app.use(express.static("./public"));

//add for RRT Monthly Spending
function query_DB(POST, response) {
    if (isNonNegativeInteger(POST['low_price']) &&
        isNonNegativeInteger(POST['high_price'])) { // Only query if we got a low and high price
        low = POST['low_price']; // Grab the parameters from the submitted form
        high = POST['high_price'];
        query = "SELECT * FROM Drink where price > " + low + " and price < " + high; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);

            // Now build the response: table of results and form to do another query
            response_form = `<form action="monthly_spending.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>Drink Name</td><td><B>Price</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].DrinkName}</td>`;
                response_form += `<td> $${res_json[i].Price}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Please go back and enter a price range (minimum and maximum). Thank you! :)");
    }
}

//add for RRT Monthly Spending
app.post("/process_query", function(request, response) {
    let POST = request.body;
    query_DB(POST, response);
});

//add for RRT Customer Reward page
function query_DB_reward(POST, response) {
    if (typeof(POST['Fname']) !== 'undefined' &&
        typeof(POST['Lname']) !== 'undefined' &&
        isNonNegativeInteger(POST['CustomerID'])
    ) {
        Fname = JSON.stringify(POST['Fname']);
        Lname = JSON.stringify(POST['Lname']);
        CustomerID = POST['CustomerID'];

        query = "SELECT FName, LName, RewardStatus, RewardAmt, Description FROM Customer, Redeemable WHERE FName = " + Fname + " and LName = " + Lname + " and CustomerID = " + CustomerID + " and RewardStatus > RewardAmt"; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);

            // Now build the response: table of results and form to do another query
            response_form = `<form action="rewards_page.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>NumOfStamps</td><td><B>RewardStampsNeeded</td></b><td><B>RedeemableReward</td>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].RewardStatus}</td>`;
                response_form += `<td> ${res_json[i].RewardAmt}</td>`;
                response_form += `<td> ${res_json[i].Description}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Please go back and re-enter your name and customer ID. Thank you! :)");
    }
}

//add for RRT Customer Reward page
app.post("/process_customer_reward", function(request, response) {
    let POST = request.body;
    query_DB_reward(POST, response);
});

//add for RRT Rewards Utilization (range)
function query_DB_range(POST, response) {
    if (isNonNegativeInteger(POST['low_stamp']) &&
        isNonNegativeInteger(POST['high_stamp'])) { // Only query if we got a low and high price
        low = POST['low_stamp']; // Grab the parameters from the submitted form
        high = POST['high_stamp'];
        query = "SELECT CustomerID, FName, LName, RewardStatus FROM Customer where RewardStatus > " + low + " and RewardStatus < " + high; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);

            // Now build the response: table of results and form to do another query
            response_form = `<form action="rewards_utilization.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>CustomerID</td><td><B>Fname</td><td><B>Lname</td><td><B>RewardStamps</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].CustomerID}</td>`;
                response_form += `<td> ${res_json[i].FName}</td>`;
                response_form += `<td> ${res_json[i].LName}</td>`;
                response_form += `<td> ${res_json[i].RewardStatus}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Please go back and enter a range (minimum and maximum).");
    }
}

//add for RRT Rewards Utilization (range)
app.post("/process_utilization_range", function(request, response) {
    let POST = request.body;
    query_DB_range(POST, response);
});

//add for RRT Rewards Utilization (name)
function query_DB_name(POST, response) {
    if (typeof(POST['Fname']) != 'undefined' &&
        typeof(POST['Lname']) != 'undefined') { // Only query if we got a low and high price
        Fname = JSON.stringify(POST['Fname']); // Grab the parameters from the submitted form
        Lname = JSON.stringify(POST['Lname']);
        query = "SELECT CustomerID, FName, LName, RewardStatus FROM Customer WHERE FName = " + Fname + " and LName = " + Lname; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);

            // Now build the response: table of results and form to do another query
            response_form = `<form action="rewards_utilization.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>CustomerID</td><td><B>Fname</td><td><B>Lname</td><td><B>RewardStamps</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].CustomerID}</td>`;
                response_form += `<td> ${res_json[i].FName}</td>`;
                response_form += `<td> ${res_json[i].LName}</td>`;
                response_form += `<td> ${res_json[i].RewardStatus}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Please go back and enter a customer's first and last name.");
    }
}

//add for RRT Rewards Utilization (name)
app.post("/process_utilization_name", function(request, response) {
    let POST = request.body;
    query_DB_name(POST, response);
});

//add for RRT
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// start server (Assignment 1 Instruction example)
//RRT: change to port 8080
app.listen(8080, () => console.log("listening on port 8080"));