require("dotenv").config();
var express = require("express");
var App = require("./service/ExpressApp");
// import DB from "./service/DataBase";

const app = express();

async function startServer() {
  await App(app);
  // const port = process.env.PORT || 5000;
  const port = 5000;
  // const port = 5000;
  app.listen(port, () => {
    console.log(`Server is listing on Port ${port}`);
  });
}

startServer();
