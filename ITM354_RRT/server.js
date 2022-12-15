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
var mysql = require('mysql');
console.log("Connecting to localhost...");
var con = mysql.createConnection({
    host: '127.0.0.1',
    user: "root",
    port: 3306,
    database: "RRT",
    password: ""
});

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

// monitor all requests
app.all("", function(request, response, next) {
    console.log(request.method + " to " + request.path);
    next();
});

//Data validation: input value is a non-negative integer
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

//RRT Monthly Spending
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
            // Table of results
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
//RRT Monthly Spending
app.post("/process_query", function(request, response) {
    let POST = request.body;
    query_DB(POST, response);
});

//RRT Monthly Orders
function query_order_c(POST, response) {
    if (isNonNegativeInteger(POST['customer_ID']) &&
        POST['month'] != ' -- Select an option -- ') {
        CustomerID = POST['customer_ID'];
        query = "SELECT DATE_FORMAT(OrderDate, '%m/%d') AS OrderDate, OrderNum, DrinkName, Quantity FROM Orders, Drink WHERE Drink.DrinkID = Orders.DrinkID AND CustomerID = " + CustomerID; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="monthly_orders_c.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>OrderDate</td><td><B>OrderNum</td><td><B>DrinkName</td><td><B>Quantity</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].OrderDate}</td>`;
                response_form += `<td> ${res_json[i].OrderNum}</td>`;
                response_form += `<td> ${res_json[i].DrinkName}</td>`;
                response_form += `<td> ${res_json[i].Quantity}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Please go back to select a month and enter your customer ID. Thank you! :)");
    }
}
//RRT Monthly Orders
app.post("/monthly_orders_c", function(request, response) {
    let POST = request.body;
    query_order_c(POST, response);
});

//RRT Customer Reward page
function query_DB_reward(POST, response) {
    if (typeof(POST['Fname']) !== 'undefined' &&
        typeof(POST['Lname']) !== 'undefined' &&
        isNonNegativeInteger(POST['CustomerID'])
    ) {
        Fname = JSON.stringify(POST['Fname']);
        Lname = JSON.stringify(POST['Lname']);
        CustomerID = POST['CustomerID'];
        query = "SELECT FName, LName, RewardStatus, RewardAmt, Description FROM publiccustomerinfo, Redeemable WHERE FName = " + Fname + " and LName = " + Lname + " and CustomerID = " + CustomerID + " and RewardStatus > RewardAmt"; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="rewards_page.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>Current # Of Stamps</td><td><B>Redeemable Reward</td></b><td><B>Reward Stamps Needed</td>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].RewardStatus}</td>`;
                response_form += `<td> ${res_json[i].Description}</td>`;
                response_form += `<td> ${res_json[i].RewardAmt}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Please go back and re-enter your name and customer ID. Thank you! :)");
    }
}
//RRT Customer Reward page
app.post("/process_customer_reward", function(request, response) {
    let POST = request.body;
    query_DB_reward(POST, response);
});
//RRT Rewards Utilization (range)
function query_DB_range(POST, response) {
    if (isNonNegativeInteger(POST['low_stamp']) &&
        isNonNegativeInteger(POST['high_stamp'])) {
        low = POST['low_stamp']; // Grab the parameters from the submitted form
        high = POST['high_stamp'];
        query = "SELECT CustomerID, FName, LName, RewardStatus FROM publiccustomerinfo where RewardStatus > " + low + " and RewardStatus < " + high; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
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
//RRT Rewards Utilization (range)
app.post("/process_utilization_range", function(request, response) {
    let POST = request.body;
    query_DB_range(POST, response);
});

//RRT Rewards Utilization (name)
function query_DB_name(POST, response) {
    if (typeof(POST['Fname']) != 'undefined' &&
        typeof(POST['Lname']) != 'undefined') {
        Fname = JSON.stringify(POST['Fname']);
        Lname = JSON.stringify(POST['Lname']);
        query = "SELECT CustomerID, FName, LName, RewardStatus FROM publiccustomerinfo WHERE FName = " + Fname + " and LName = " + Lname; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
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

//RRT Rewards Utilization (name)
app.post("/process_utilization_name", function(request, response) {
    let POST = request.body;
    query_DB_name(POST, response);
});

//RRT Total Inventory
function query_tot_inventory(POST, response) {
    if (POST['View Report'] != 'undefined') {
        query = "SELECT ItemID, ItemName, Quantity, Category FROM Inventory"; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="inventory_level.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>ItemID</td><td><B>ItemName</td><td><B>Quantity</td><td><B>Category</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].ItemID}</td>`;
                response_form += `<td> ${res_json[i].ItemName}</td>`;
                response_form += `<td> ${res_json[i].Quantity}</td>`;
                response_form += `<td> ${res_json[i].Category}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Query broken... fix um!");
    }
}

//RRT total inventory
app.post("/total_inventory", function(request, response) {
    let POST = request.body;
    query_tot_inventory(POST, response);
});

//RRT perishable/non-perishable inventory
function query_perish_non_perish(POST, response) {
    if (POST['category'] == 'perishable') {
        category = JSON.stringify(POST['category']);
        query = "SELECT ItemID, ItemName, Quantity FROM Inventory WHERE Category = " + category; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="inventory_level.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>ItemID</td><td><B>ItemName</td><td><B>Quantity</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].ItemID}</td>`;
                response_form += `<td> ${res_json[i].ItemName}</td>`;
                response_form += `<td> ${res_json[i].Quantity}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else if (POST['category'] == 'non-perishable') {
        category = JSON.stringify(POST['category']);
        query = "SELECT ItemID, ItemName, Quantity FROM Inventory WHERE Category = " + category; // Build the query string
        con.query(query, function(err, result, fields) { // Run the query
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="inventory_level.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>ItemID</td><td><B>ItemName</td><td><B>Quantity</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].ItemID}</td>`;
                response_form += `<td> ${res_json[i].ItemName}</td>`;
                response_form += `<td> ${res_json[i].Quantity}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("Code not working...try again~ :P");
    }
}

//RRT perishable/non-perishable inventory
app.post("/perish_nonperish_invent", function(request, response) {
    let POST = request.body;
    query_perish_non_perish(POST, response);
});

//RRT vendor transactions (restock inventory)
function query_vendor_transaction(POST, response) {
    if (POST['month'] == 'October') {
        query = "SELECT TransactionNum, DATE_FORMAT(Date, '%m/%d') AS TransactionDate, VendorName, ItemName, Restocks.Quantity FROM Restocks, Vendor, Inventory WHERE Restocks.VendorID = Vendor.VendorID AND Restocks.ItemID = Inventory.ItemID AND MONTH(Restocks.Date) = 10 ORDER BY TransactionNum";
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="vendors.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>TransactionNum</td><td><B>TransactionDate</td><td><B>VendorName</td><td><B>ItemName</td><td><B>Quantity</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].TransactionNum}</td>`;
                response_form += `<td> ${res_json[i].TransactionDate}</td>`;
                response_form += `<td> ${res_json[i].VendorName}</td>`;
                response_form += `<td> ${res_json[i].ItemName}</td>`;
                response_form += `<td> ${res_json[i].Quantity}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("So close!! I wanna sleep T^T");
    }
}

//RRT vendor transactions (restock inventory)
app.post("/vendor_transaction", function(request, response) {
    let POST = request.body;
    query_vendor_transaction(POST, response);
});

//RRT vendor by name
function query_vendor_name(POST, response) {
    if (POST['vendor'] == 'Costco') {
        query = "SELECT VendorID, VendorName, Address, PhoneNum FROM Vendor WHERE VendorName = 'Costco Wholesale'";
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="vendors.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>VendorID</td><td><B>VendorName</td><td><B>Address</td><td><B>PhoneNum</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].VendorID}</td>`;
                response_form += `<td> ${res_json[i].VendorName}</td>`;
                response_form += `<td> ${res_json[i].Address}</td>`;
                response_form += `<td> ${res_json[i].PhoneNum}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else if (POST['vendor'] == 'Chefzone') {
        query = "SELECT VendorID, VendorName, Address, PhoneNum FROM Vendor WHERE VendorName = 'ChefZone'";
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="vendors.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>VendorID</td><td><B>VendorName</td><td><B>Address</td><td><B>PhoneNum</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].VendorID}</td>`;
                response_form += `<td> ${res_json[i].VendorName}</td>`;
                response_form += `<td> ${res_json[i].Address}</td>`;
                response_form += `<td> ${res_json[i].PhoneNum}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else if (POST['vendor'] == 'Sams') {
        query = "SELECT VendorID, VendorName, Address, PhoneNum FROM Vendor WHERE VendorName = 'Sams Club'";
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="vendors.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>VendorID</td><td><B>VendorName</td><td><B>Address</td><td><B>PhoneNum</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].VendorID}</td>`;
                response_form += `<td> ${res_json[i].VendorName}</td>`;
                response_form += `<td> ${res_json[i].Address}</td>`;
                response_form += `<td> ${res_json[i].PhoneNum}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else if (POST['vendor'] == 'Hiboba') {
        query = "SELECT VendorID, VendorName, Address, PhoneNum FROM Vendor WHERE VendorName = 'Hawaii Boba Wholesale Club'";
        con.query(query, function(err, result, fields) {
            if (err) throw err;
            console.log(result);
            var res_string = JSON.stringify(result);
            var res_json = JSON.parse(res_string);
            console.log(res_json);
            // Table of results
            response_form = `<form action="vendors.html" method="GET">`;
            response_form += `<table border="3" cellpadding="5" cellspacing="5">`;
            response_form += `<td><B>VendorID</td><td><B>VendorName</td><td><B>Address</td><td><B>PhoneNum</td></b>`;
            for (i in res_json) {
                response_form += `<tr><td> ${res_json[i].VendorID}</td>`;
                response_form += `<td> ${res_json[i].VendorName}</td>`;
                response_form += `<td> ${res_json[i].Address}</td>`;
                response_form += `<td> ${res_json[i].PhoneNum}</td></tr>`;
            }
            response_form += "</table>";
            response_form += `<input type="submit" value="Click to Go Back"> </form>`;
            response.send(response_form);
        });
    } else {
        response.send("It's working! Now finish it T^T");
    }
}

//RRT vendor by name
app.post("/vendor_by_name", function(request, response) {
    let POST = request.body;
    query_vendor_name(POST, response);
});

//RRT
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

// start server
app.listen(8080, () => console.log("listening on port 8080"));