import db from "../models/index";
require('dotenv').config();
import emailService from "../services/emailService";
import { v4 as uuidv4 } from 'uuid';


let buildURLEmail = (doctorId, token) => {
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
}



let postPatientBookAppointmentService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.email || !dataInput.date
                || !dataInput.doctorId || !dataInput.timeType || !dataInput.fullName
                || !dataInput.phoneNumber || !dataInput.address || !dataInput.reason

            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let token = uuidv4();
                let urlEmail = buildURLEmail(dataInput.doctorId, token)

                await emailService.sendEmailService({
                    receiverEmail: dataInput.email,
                    patientName: dataInput.fullName,
                    doctorName: dataInput.doctorName,
                    time: dataInput.time,
                    language: dataInput.language,
                    redirectLink: urlEmail,
                })

                let user = await db.User.findOrCreate({
                    where: { email: dataInput.email },
                    defaults: {
                        email: dataInput.email,
                        roleId: 'R3',
                        address: dataInput.address,
                        gender: dataInput.gender,
                        phoneNumber: dataInput.phoneNumber,
                        positionId: 'P5',
                    }
                })

                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { patientId: user[0].id },
                        defaults: {
                            patientId: user[0].id,
                            doctorId: dataInput.doctorId,
                            date: dataInput.date,
                            statusId: 'S1',
                            timeType: dataInput.timeType,
                            token: token,
                        }
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Booking success'
                })
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