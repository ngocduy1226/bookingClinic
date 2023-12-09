import db from "../models/index";
require('dotenv').config();
import emailService from "../services/emailService";
import { v4 as uuidv4 } from 'uuid';
import _ from "lodash";

let buildURLEmail = (doctorId, token) => {
    
    let result = `http://localhost:3000/verify-booking?token=${token}&doctorId=${doctorId}`;
   // let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}



let postPatientBookAppointmentService = (dataInput) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.email || !dataInput.date
                || !dataInput.doctorId || !dataInput.timeType || !dataInput.firstName
                || !dataInput.lastName
                || !dataInput.phoneNumber || !dataInput.address || !dataInput.reason

            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let token = uuidv4();
                let user = await db.User.findOrCreate({
                    where: { email: dataInput.email },
                    defaults: {
                        email: dataInput.email,
                        roleId: 'R3',
                        address: dataInput.address,
                        gender: dataInput.gender,
                        lastName: dataInput.lastName,
                        firstName: dataInput.firstName,
                        phoneNumber: dataInput.phoneNumber,
                        positionId: 'P5',
                        birthday: dataInput.birthday,
                    },
                    raw: false,
                })



                if (user && user[0]) {
                   

                    user[0].firstName = dataInput.firstName;
                    user[0].lastName = dataInput.lastName;
                    user[0].address = dataInput.address;
                    user[0].roleId = 'R3';
                    user[0].gender = dataInput.gender;
                    user[0].phoneNumber = dataInput.phoneNumber;
                    user[0].positionId = 'P5';
                    user[0].birthday = dataInput.birthday;

                    await user[0].save();

                    // let booking = await db.Booking.findOrCreate({
                    //     where: {
                    //         patientId: user[0].id,
                    //         date: dataInput.date,
                    //     },
                    //     defaults: {
                    //         patientId: user[0].id,
                    //         doctorId: dataInput.doctorId,
                    //         date: dataInput.date,
                    //         reason: dataInput.reason,
                    //         statusId: 'S1',
                    //         timeType: dataInput.timeType,
                    //         token: token,
                    //     },
                    //     raw: false,
                    //     nest: true,
                    //     isNewRecord: false,
                    // })


                    let booking = await db.Booking.findOne({
                        where: {
                            patientId: user[0].id,
                            date: dataInput.date,
                            statusId: 'S2',
                        },
                        raw: false,
                    })

                    if (!booking) {
                        await db.Booking.create({
                            patientId: user[0].id,
                            doctorId: dataInput.doctorId,
                            date: dataInput.date,
                            reason: dataInput.reason,
                            statusId: 'S1',
                            timeType: dataInput.timeType,
                            token: token,
                        })

                        let schedule = await db.Schedule.findOne({
                            where: {
                                doctorId: dataInput.doctorId,
                                timeType: dataInput.timeType,
                                date: dataInput.date,
                            },
                            raw: false,
                        })

                        if (schedule) {
                            schedule.currentNumber = schedule.currentNumber + 1;
                            await schedule.save();

                        }
                      
                        let urlEmail = buildURLEmail(dataInput.doctorId, token)

                        await emailService.sendEmailService({
                            receiverEmail: dataInput.email,
                            patientName: dataInput.firstName,
                            doctorName: dataInput.doctorName,
                            time: dataInput.time,
                            language: dataInput.language,
                            redirectLink: urlEmail,
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Booking success'
                        })

                    } else {
                        resolve({
                            errCode: 4,
                            errMessage: 'Examination schedule failed'
                        })
                    }


                }

            }


        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let postVerifyBookAppointmentService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameter"
                })
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });

                if (appointment) {
                    appointment.statusId = 'S2';
                    appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Booking success"
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Examination schedule has been confirmed or does not exist"
                    })
                }
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

module.exports = {
    postPatientBookAppointmentService: postPatientBookAppointmentService,
    postVerifyBookAppointmentService: postVerifyBookAppointmentService,
}