require("dotenv").config();
const express = require("express") as any;
const App = require("./service/ExpressApp") as any;
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
