import { raw } from "body-parser";
import db from "../models/index";
import bcrypt from "bcryptjs";
const { literal, fn, col } = require("sequelize");
const salt = bcrypt.genSaltSync(10);
import moment from 'moment';
import _, { reject } from "lodash";


let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkUserEmail(email);
            if (isExist) {
                let user = await db.User.findOne({
                    attributes: ["id", "email", "roleId",
                        "password", "firstName", "lastName",
                        "image"],
                    where: { 
                        email: email,
                        statusUser: 0,
                     },

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

let getAllUsers = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (data.userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    where: {
                        statusUser: data.status,

                    },

                    include: [
                        {
                            model: db.Allcode, as: 'genderData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'roleData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true,
                });
            }


            if (data.userId && data.userId != "ALL") {
                users = await db.User.findOne({
                    where: {
                        id: data.userId,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Allcode, as: 'genderData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'roleData',
                            attributes: ['valueEn', 'valueVi']
                        },
                    ],
                    raw: false,
                    nest: true,
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
                    statusUser: 0,
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
                    raw: false,
                });
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: "The user isn's exist",
                    });
                }
                if (user) {
                    user.statusUser = 1
                    user.save();
                    // await db.User.destroy({
                    //     where: { id: id },
                    // });
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


let restoreUser = (id) => {
    console.log('id', id)
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
                    raw: false,
                });
                if (!user) {
                    resolve({
                        errCode: 2,
                        errMessage: "The user isn's exist",
                    });
                }
                if (user) {
                    user.statusUser = 0
                    user.save();
                    // await db.User.destroy({
                    //     where: { id: id },
                    // });
                    resolve({
                        errCode: 0,
                        errMessage: "The user is restored",
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

let getTotalUserService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            let total = await db.User.count({
                where: { 
                   statusUser: 0
                },
            });
            res.errCode = 0;
            res.data = total;
            resolve(res);


        } catch (e) {
            reject(e);
        }
    });
};



let getStatisticOneService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.date || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let total = {};
                if (data.doctorId != 'ALL') {


                    total = await db.Schedule.findAll({
                        where: {
                            date: data.date,
                            doctorId: data.doctorId,
                        },
                        attributes: ['date', [fn('sum', col('currentNumber')), 'total']],
                        group: ['Schedule.date'],
                        raw: true,
                        // order: literal('total DESC')
                    });
                } else {
                    total = await db.Schedule.findAll({
                        where: {
                            date: data.date,
                        },
                        attributes: ['date', [fn('sum', col('currentNumber')), 'total']],
                        group: ['Schedule.date'],
                        raw: true,
                        // order: literal('total DESC')
                    });
                }
                if (_.isEmpty(total)) {
                    total.push({
                        date: `${data.date}`,
                        total: '0'
                    })

                }
                let sum = total[0]

                resolve({
                    sum,
                    errCode: 0,
                    errMessage: 'Get total success'
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}



let getStatisticPresOneDayService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.date || !data.doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let total = {};
                if (data.doctorId != 'ALL') {

                    total = await db.Prescription.count({
                        attributes: {
                            include: [[fn("COUNT", col("bookings.id")), 'total']]
                        },

                        include: [{
                            model: db.Booking,
                            attributes: [],
                            where: {
                                date: data.date,
                                doctorId: data.doctorId,
                            }
                        }],
                        group: ['Booking.date'],
                        // order: literal('total DESC')

                    });
                } else {

                    total = await db.Prescription.count({
                        attributes: {
                            include: [[fn("COUNT", col("bookings.id")), 'total']]
                        },

                        include: [{
                            model: db.Booking,
                            attributes: [],
                            where: {
                                date: data.date
                            }
                        }],
                        group: ['Booking.date'],
                        // order: literal('total DESC')

                    });

                }
                if (_.isEmpty(total)) {
                    total.push({
                        date: `${data.date}`,
                        count: '0'
                    })
                }

                let totalPres = total[0];
                totalPres.count = '' + total[0].count

                resolve({
                    totalPres,
                    errCode: 0,
                    errMessage: 'Get total success'
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}


let getStatisticWeekService = (date, doctorId, clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            
            if (!date || !doctorId || !clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })
            } else {

                let timeFrom = (X) => {
                    let dates = [];
                    for (let I = 0; I < Math.abs(X); I++) {
                        let time = moment(new Date(date - ((X >= 0 ? I : (I - I - I)) * 24 * 60 * 60 * 1000))).startOf('day').valueOf();

                        dates.push(time);
                    }
                    return dates;
                }
                // console.log(timeFrom(-7)); // Future 7 Days
                // console.log(timeFrom(7));


                let resultBook = [];
                let resultPres = [];
                for (let i = 0; i < timeFrom(7).length; i++) {
                    if (clinicId != 'ALL' && doctorId === 'ALL') {
                        let listDoctors = await db.Doctor_Info.findAll({
                            where: {
                                clinicId: clinicId
                            },
                            attributes: ['doctorId'],
                            raw: true,
                        });
                      
                       let totalPres = 0;
                       let sumBook = 0;
                        for (let x = 0; x < listDoctors.length; x++) {
                            let resBook = await getStatisticOneService({
                                date: timeFrom(7)[i],
                                doctorId: listDoctors[x].doctorId,
                            })
                            let resPres = await getStatisticPresOneDayService({
                                date: timeFrom(7)[i],
                                doctorId: listDoctors[x].doctorId,
                            })
                        
                            totalPres = totalPres + + resPres.totalPres.count;
                            sumBook = sumBook + + resBook.sum.total;
    
                        } 
                        resultPres.push({
                            date: timeFrom(7)[i],
                            count: totalPres,
                        } );
                        resultBook.push({
                            date: timeFrom(7)[i],
                            total: sumBook
                        });

                    } else {
                        let resBook = await getStatisticOneService({
                            date: timeFrom(7)[i],
                            doctorId: doctorId,
                        })
                        let resPres = await getStatisticPresOneDayService({
                            date: timeFrom(7)[i],
                            doctorId: doctorId,
                        })

                        resultPres.push(resPres.totalPres);
                        resultBook.push(resBook.sum);
                    }


                }

                let dataBooking = resultBook.reverse();
                let dataPres = resultPres.reverse();


                resolve({
                    dataBooking,
                    dataPres,
                    errCode: 0,
                    errMessage: 'Get total success'
                })
            }

        }

        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}



let getStatisticPresByDoctorService  = (doctor) => {
    return new Promise(async (resolve, reject) => {
        try{
    if(!doctor) {
        resolve({
            errCode: 1,
            errMessage: "Missing input"
        })
    }else{ 
        
        let data = await db.Prescription.count({
            attributes: {
                include: [[fn("COUNT", col("bookings.id")), 'total']]
            },

            include: [{
                model: db.Booking,
                attributes: [],
                where: {
                    doctorId: doctor,
                }
            }],
           // group: ['Booking.date'],
            // order: literal('total DESC')

        });

        resolve({
            errCode: 0,
            data,
        })
    }
        }
        catch(e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

module.exports = {
    handleUserLogin: handleUserLogin,
    checkUserEmail: checkUserEmail,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    restoreUser: restoreUser,
    updateUser: updateUser,
    getAllCodeService: getAllCodeService,
    getTotalUserService: getTotalUserService,
    getStatisticWeekService: getStatisticWeekService,
    getStatisticOneService: getStatisticOneService,
    getStatisticPresOneDayService: getStatisticPresOneDayService,
    getStatisticPresByDoctorService: getStatisticPresByDoctorService,
};
