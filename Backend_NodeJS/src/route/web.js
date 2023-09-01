import express from "express";

import homeController from "../controllers/homeController";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
   router.get('/', homeController.getHomePage);

   router.get('/user', homeController.getUser);
   router.get('/user/edit-user', homeController.getEditUser);
   router.post('/user/put-user', homeController.putUser);

   router.get('/user/delete-user', homeController.deleteUser);

   router.get('/user/login', homeController.getUserLogin);
   router.get('/user/sign', homeController.getUserSign);

   router.post('/user/user-sign', homeController.postUserSign);

   // router.get('/hehe', (req, res) => {
   //    return res.send("hello world hehe");
   //   });
  
   router.post('/api/login', userController.handleLogin);
   router.get('/api/get-all-users', userController.handleGetAllUser );
   router.post('/api/create-new-user', userController.handleCreateNewUser );
   router.put('/api/edit-user', userController.handleEditUser );
   router.delete('/api/delete-user', userController.handleDeleteUser );

   router.get('/allcode', userController.getAllCodes)

   return app.use("/", router);


}

module.exports = initWebRoutes;
