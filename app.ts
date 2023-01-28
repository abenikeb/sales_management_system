require("dotenv").config();
import express from "express";
import AppServer from "./service/ExpressApp";

const app = express();

const startServer = async () => {
  await AppServer(app);
  let port = process.env.PORT as any | 5000;

  app.listen(port, () => {
    console.log(`Server is listing on Port ${port}`);
  });
};

startServer();
