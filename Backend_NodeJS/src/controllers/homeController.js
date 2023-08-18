import { response } from "express";
import db from "../models/index";
import UserService from "../services/CRUDService";

let getHomePage = async (req, res) => {
  //return res.send('hello controller');
  try {
    let data = await db.User.findAll();
    // console.log('-------------------------------------')
    // console.log(data);
    // console.log('-------------------------------------')
    return res.render("homePage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (err) {
    console.log(err);
  }
};

let getUser = async (req, res) => {
  let data = await UserService.getAllUser();
  console.log('---------------------------------');
  console.log(data);
  console.log('---------------------------------');
  return res.render("user/getAllUser", {
    dataTable: data
  });

};

let getEditUser = async (req, res) => {
  let userId = req.query.id;
  if(userId) {
    let userData = await UserService.getUserInfoById(userId);
    
    return res.render('user/editUser.ejs', {
       user: userData,
    })
  } else {
    return res.send('user not found');
  }
};

let putUser = async (req,res ) => {
    let data = req.body;
    let allUsers = await UserService.updateUserData(data);
    return res.render("user/getAllUser", {
      dataTable: allUsers,
    });
  
}

let deleteUser = async (req, res) => {
  let id = req.query.id;
  if(id) {
     await UserService.deleteUserById(id);
      return res.send('delete user done');
  }
   else {
    return res.send('delete user failed');
   }

 
}

let getUserSign = (req, res) => {
  return res.render("user/sign.ejs");
};
let getUserLogin = (req, res) => {
  return res.render("user/login.ejs");
};

let postUserSign = async (req, res) => {
  let message = await UserService.createNewUser(req.body);
  console.log(message);
  return res.send("đã đăng ký thành công");
};
module.exports = {
  getHomePage: getHomePage,
  getUser: getUser,
  getEditUser: getEditUser,
  deleteUser: deleteUser,
  getUserLogin: getUserLogin,
  getUserSign: getUserSign,
  postUserSign: postUserSign,
  putUser: putUser,
};
