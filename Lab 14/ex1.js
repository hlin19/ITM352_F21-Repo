var fs = require("fs");

var filename = "./user_data.json";

data = fs.readFileSync(filename, "utf-8");

user_data = JSON.parse(data);

console.log("User_date", user_data);
