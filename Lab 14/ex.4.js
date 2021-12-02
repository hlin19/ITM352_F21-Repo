user_name = POST["username"];
user_pass = POST["password"];
console.log("User name=" + user_name + " password=" + user_pass);

if (user_data[user_name] != undefined) {
  if (user_data[user_name].password == user_pass) {
    // Good login
    response.send("Got a good login");
  } else {
    // Bad login, redirect
    response.send("Sorry bud");
  }
} else {
  // Bad username
  response.send("Bad username");
}

app.get("/register", function (request, response) {
  // Give a simple register form
  str = `
<body>
<form action="/register" method="POST">
<input type="text" name="username" size="40" placeholder="enter username" ><br />
<input type="password" name="password" size="40" placeholder="enter password"><br />
<input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
<input type="email" name="email" size="40" placeholder="enter email"><br />
<input type="submit" value="Submit" id="submit">
</form>
</body>
    `;
  response.send(str);
});

app.post("/register", function (request, response) {
  // process a simple register form
  console.log("Got a POST to register");
  POST = request.body;
  if (user_data[user_name].password == user_data[user_name].username) {
    user_name = POST["username"];
    user_pass = POST["password"];
    user_email = POST["email"];
    user_data[user_name] = {};
    user_data[user_name].name = user_name;
    user_data[user_name].password = user_pass;
    user_data[user_name].email = user_email;

    data = JSON.stringify(user_data);
    fs.writeFileSync(filename, data, "utf-8");

    response.send("User " + user_name + " added!");
    console.log("User name=" + user_name + " password=" + user_pass);
  } else {
    app.post("/register", function (request, response))
    }
});

app.listen(8080, () => console.log(`listening on port 8080`));
