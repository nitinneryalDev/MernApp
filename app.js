const dotenv = require("dotenv");
const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
dotenv.config({ path: "./config.env" });
require(`./db/conn`);

app.use(express.json());

app.use(cookieParser());

// We link the router files to make routes
app.use(require("./router/auth"));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`hello world from the server`);
});



// app.get("/contact", (req, res) => {
//   res.cookie("hello", "thapa");
//   res.send(`hello world from the contact`);
// });

app.get("/signin", (req, res) => {
  res.send(`hello world from the signin`);
});

app.get("/signup", (req, res) => {
  res.send(`hello world from the signup`);
});


if(process.env.NODE_ENV = "production") {
  app.use(express.static("client/build"));
  
}



app.listen(PORT, () => {
  console.log(`the app is running on the port no ${PORT}`);
});
