require("dotenv").config();
const express = require("express");
const App = require("./service/ExpressApp");

const app = express();

async function startServer() {
  await App(app);
  const port = 5000;

  app.listen(port, () => {
    console.log(`Server is listing on Port ${port}`);
  });
}

startServer();
