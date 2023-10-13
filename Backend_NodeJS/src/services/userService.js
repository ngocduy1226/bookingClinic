import { raw } from "body-parser";
import db from "../models/index";
import bcrypt from "bcryptjs";

const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ["id", "email", "roleId", "password", "firstName", "lastName"],
                    where: { email: email },

                    raw: true,
                });
                if (user) {
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "Ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = "User's not found";
                }
            } else {
                userData.errCode = 1;
                userData.errMessage = "Your's Email isn't exist in your system. ";
            }
            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let checkUserEmail = (userEmail) => {
    return new Promise(async (resole, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resole(true);
            } else {
                resole(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }

         
            if (userId && userId != "ALL") {
                users = await db.User.findOne({
                    where: {
                        id: userId,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkUserEmail(data.email);
            if (check === true) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used.",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    phoneNumber: data.phoneNumber,
                    address: data.address,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.image,
                    birthday: data.birthday,

                });
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

let deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let user = await db.User.findOne({
                    where: { id: id },
                });
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: "The user isn's exist",
                    });
                }
                if (user) {
                    await db.User.destroy({
                        where: { id: id },
                    });
                    resolve({
                        errCode: 0,
                        errMessage: "The user is deleted",
                    });
                }
            }

        } catch (err) {
            reject(err);
        }
    });
};

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                })
            }

            if (user) {
                (user.firstName = data.firstName),
                    (user.lastName = data.lastName),
                    (user.email = data.email),
                    (user.address = data.address),
                    (user.phoneNumber = data.phoneNumber),
                    (user.gender = data.gender),
                    (user.positionId = data.positionId);
                (user.roleId = data.roleId);
                (user.birthday = data.birthday);
                if (data.image) {
                    (user.image = data.image);
                }

                await user.save();

                resolve({
                    errCode: 0,
                    errMessage: "Update the user succeeds!",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "User's not found",
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            if (!typeInput) {
                res.errCode = 1;
                res.errMessage = "Not parameter";
            } else {
                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                res.errCode = 0;
                res.data = allcode;
                resolve(res);
            }


        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService,
};
