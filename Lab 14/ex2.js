var fs = require("fs");
const { exit } = require("process");

var filename = "./user_data.json";

if (fs.existsSync(filename)) {
  data = fs.readFileSync(filename, "utf-8");
  user_data = JSON.parse(data);
  console.log("User_date", user_data);

  fileStats = fs.statSync(filename);
  console.log("File" + filename + "has" + filestats.size + "character");
} else {
  console.log("Enter the correct filename bozo!");
  exit("Exiting Program");
}
