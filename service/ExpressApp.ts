import express, { Application, Request } from "express";
import bodyParser from "body-parser";
import path from "path";

import {
  AdminRoute,
  UserRoute,
  // CustomerRoute,
  OrderRoute,
  ProductRoute,
} from "../router";
import { error } from "../middleware/error";

export default async (app: Application) => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use("/images", express.static(path.join(__dirname, "images")));

  // app.use("/", CustomerRoute);
  app.use("/api/admin", AdminRoute);
  app.use("/api/user", UserRoute);
  app.use("/api/order", OrderRoute);
  app.use("/api/product", ProductRoute);
  app.use(error);

  return app;
};

// export interface IGetUserAuthInfoRequest extends Request {
//   user?: string; // or any other type
// }
