import express from "express";

import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
   router.get('/', homeController.getHomePage);
   router.get('/user', homeController.getUser);
   
   
   router.get('/hehe', (req, res) => {
      return res.send("hello world hehe");
     });
   return app.use("/", router);
}

module.exports = initWebRoutes;
