import db from "../models/index";
require('dotenv').config();
import _, { curryRight, reject } from "lodash";
import emailService from '../services/emailService';
import roomService from '../services/roomService';
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
const { Op } = require("sequelize");
import moment from 'moment';


let getTopDoctorHomeServer = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: data.limit,
                where: {
                     roleId: 'R2',
                     statusUser: data.status
             },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },

                ],
                raw: true,
                nest: true,
            })

            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) {
            reject(e);
        }
    });
}


let getAllDoctorsServer = (status) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2',
                    statusUser: status
                },
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.Allcode, as: 'genderData',
                        attributes: ['valueEn', 'valueVi']
                    },
                    {
                        model: db.Allcode, as: 'positionData',
                        attributes: ['valueEn', 'valueVi']
                    },
                ],
                raw: false,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: doctors
            })

        }
        catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}

let checkRequiredFields = (inputData) => {
    let arrFields = ['doctorId', 'contentHTML', 'contentMarkdown', 'action', 'selectedPrice', 'selectedPayment',
        'selectedProvince', 'note', 'selectedSpecialty'
    ]

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }
    return {
        isValid: isValid,
        element: element
    }


}

let createDetailInfoDoctorService = (inputData) => {

    return new Promise(async (resolve, reject) => {
        try {
            let check = checkRequiredFields(inputData);
            if (check.isValid === false) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing input ${check.element}`,
                })
            } else {
                // upsert markdown
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    })
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    })

                    if (doctorMarkdown) {
                        doctorMarkdown.contentHTML = inputData.contentHTML;
                        doctorMarkdown.contentMarkdown = inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }

                }

                //upsert the info doctor
                let doctor = await db.Doctor_Info.findOne({
                    where: { doctorId: inputData.doctorId },
                    raw: false,
                })

                //create info doctor
                if (!doctor) {
                    await db.Doctor_Info.create({
                        priceId: inputData.selectedPrice,
                        paymentId: inputData.selectedPayment,
                        provinceId: inputData.selectedProvince,
                        specialtyId: inputData.selectedSpecialty,
                        clinicId: inputData.selectedClinic,
                        doctorId: inputData.doctorId,
                        note: inputData.note,
                    })
                } else {
                    //edit doctor
                    doctor.priceId = inputData.selectedPrice;
                    doctor.provinceId = inputData.selectedProvince;
                    doctor.paymentId = inputData.selectedPayment;
                    doctor.clinicId = inputData.selectedClinic;
                    doctor.specialtyId = inputData.selectedSpecialty;
                    doctor.note = inputData.note;


                    await doctor.save();
                }


                resolve({
                    errCode: 0,
                    errMessage: "Create info detail doctor success",
                    doctor,
                })
            }
        } catch (e) {
            console.log('error:', e);
            reject(e);
        }
    })
}


let getDetailDoctorByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                        exclude: ['password', 'gender'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes:
                                ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['doctorId', 'createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                            ],
                        },


                    ],
                    raw: false,
                    nest: true,

                })

                if (!data) data = {}

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data
                })
            }


        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}


let getInfoDoctorByIdMarkdownService = (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let data = await db.Markdown.findOne({
                    where: {
                        doctorId: idInput
                    },

                })


                if (!data) data = {}

                resolve({
                    errCode: 0,
                    data
                })
            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}


let bulkCreateScheduleService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate || !data.roomId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required schedule data"
                })
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }

                let exiting = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber', 'roomId'],
                    raw: true,
                });
                //convert date
                // if(exiting && exiting.length > 0) {
                //     exiting = exiting.map( item => {
                //         item.date = new Date(item.date).getTime();
                //         return item;
                //     })
                // } 

                //compare different
                let toCreate = _.differenceWith(schedule, exiting, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });

                let toDelete = _.differenceWith(exiting, schedule, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                   
                    for (let i = 0; i < toCreate.length; i++) {
                       let res =  await roomService.handleChooseByDateService({
                            date: toCreate[i].date,
                            roomId: toCreate[i].roomId,
                            status: 'SR1',
                            timeType: toCreate[i].timeType,
                        });
                       
                    }

                }

                if (toDelete && toDelete.length > 0) {
                    toDelete.map(async item => {
                        await db.Schedule.destroy({
                            where: {
                                timeType: item.timeType,
                                date: item.date,
                                doctorId: item.doctorId,
                                
                            }

                        })
                        return item
                    })

                    for (let i = 0; i < toDelete.length; i++) {
                        await roomService.handleChooseByDateService({
                            date: toDelete[i].date,
                            roomId: toDelete[i].roomId,
                            status: 'SR2',
                            timeType: toDelete[i].timeType,
                        });
                    }

                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })

            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}

let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                        currentNumber: { [Op.lt]: MAX_NUMBER_SCHEDULE },
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData',
                         attributes: ['valueEn', 'valueVi'] ,
                          
                        },
                        { model: db.Room, as: 'RoomScheduleData',
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [
                            { model: db.Clinic, as: 'roomClinicData', attributes: ['name'] },
                        ],
                    
                    },
                        { model: db.User, as: 'doctorData', attributes: ['lastName', 'firstName'] },

                    ],
                    raw: true,
                    nest: true,
                })
                if (!schedule) schedule = [];

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: schedule,
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let getExtraDoctorInfoByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let infoDoctor = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputId,

                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Specialty, as: 'specialtyData', attributes: ['name'] },
                    ],
                    raw: true,
                    nest: true,
                })

                if (!infoDoctor) infoDoctor = [];
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: infoDoctor,
                })
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let getProfileDoctorInfoByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId
                    },
                    attributes: {
                        exclude: ['password', 'gender'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes:
                                ['contentHTML', 'contentMarkdown', 'description']
                        },
                        {
                            model: db.Allcode, as: 'positionData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['doctorId', 'createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'priceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'paymentData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'provinceData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Specialty, as: 'specialtyData',
                                    attributes: ['name']
                                },
                            ],
                        },


                    ],
                    raw: false,
                    nest: true,

                })

                if (!data) data = {}

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                resolve({
                    errCode: 0,
                    data
                })
            }


        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let getPatientByDateDoctorService = (doctorId, date, patientId, status) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!doctorId || !date || !patientId || !status) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let patient = '';
                if (doctorId === 'ALL') {
                    patient = await db.Booking.findAll({
                        where: {
                            date: date,
                            statusId: status,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'token'],
                        },
                        include: [
                            {
                                model: db.User, as: 'userData',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt', 'password', 'image', 'roleId', 'positionId', 'id'],
                                },
                                include: [
                                    {
                                        model: db.Allcode, as: 'genderData',
                                        attributes: ['valueEn', 'valueVi']
                                    },
                                ]
                            },
                            {
                                model: db.Allcode, as: 'timeTypePatient',
                                attributes: ['valueEn', 'valueVi']
                            }
                        ],

                        raw: false,
                        nest: true,
                    });
                } else if (patientId === 'ALL') {
                    patient = await db.Booking.findAll({
                        where: {
                            doctorId: doctorId,
                            date: date,
                            statusId: status,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'token'],
                        },
                        include: [
                            {
                                model: db.User, as: 'userData',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt', 'password', 'image', 'roleId', 'positionId', 'id'],
                                },
                                include: [
                                    {
                                        model: db.Allcode, as: 'genderData',
                                        attributes: ['valueEn', 'valueVi']
                                    },
                                ]
                            },
                            {
                                model: db.Allcode, as: 'timeTypePatient',
                                attributes: ['valueEn', 'valueVi']
                            }
                        ],

                        raw: false,
                        nest: true,
                    });

                     

                } else if (patientId !== 'ALL') {
                    patient = await db.Booking.findOne({
                        where: {
                            doctorId: doctorId,
                            date: date,
                            statusId: status,
                            patientId: patientId,
                        },
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'token'],
                        },
                        include: [
                            {
                                model: db.User, as: 'userData',
                                attributes: {
                                    exclude: ['createdAt', 'updatedAt', 'password', 'image', 'roleId', 'positionId', 'id'],
                                },
                                include: [
                                    {
                                        model: db.Allcode, as: 'genderData',
                                        attributes: ['valueEn', 'valueVi']
                                    },
                                ]
                            },
                            {
                                model: db.Allcode, as: 'timeTypePatient',
                                attributes: ['valueEn', 'valueVi']
                            }
                        ],

                        raw: false,
                        nest: true,
                    });
                }
                resolve({
                    errCode: 0,
                    patient,
                    errMessage: 'Get patient success'
                })


            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}




let postSendEmailPatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.doctorId || !data.patientId || !data.timeType || !data.email) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2',
                    },

                    raw: false,

                });

                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                await emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: 'Get send email success'
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}



let postCancelEmailPatientService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.doctorId || !data.patientId ||
                !data.timeType || !data.email ||
                !data.date || !data.timeTypePatient) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {

                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: 'S2',
                        date: data.date,
                    },

                    raw: false,

                });

                if (appointment) {
                    appointment.statusId = 'S4';
                    await appointment.save();

                    let schedule = await db.Schedule.findOne({
                        where: {
                            doctorId: data.doctorId,
                            timeType: data.timeType,
                            date: data.date,
                        },
                        raw: false,
                    })

                    if (schedule) {
                        schedule.currentNumber = schedule.currentNumber - 1;
                        await schedule.save();
                    }
                }

                await emailService.sendCancelAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: 'Get send email success'
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let getScheduleByIdService = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,

                    },
                    include: [
                        {
                            model: db.Room, as: 'RoomScheduleData',
                           // attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.Allcode, as: 'timeTypeData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        {
                            model: db.User, as: 'doctorData',
                            attributes: ['lastName', 'firstName']
                        },

                    ],
                    raw: true,
                    nest: true,
                })
                if (!schedule) schedule = [];
            

                // {
                //     title: 'BCH237',
                //     start: '2023-10-29T09:30:00',
                //     end: '2023-10-29T14:30:00',

                //   },
                let arr = [];
                for (let i = 0; i < schedule.length; i++) {
                    let obSchedule = {}
                    let date = moment.unix(+ schedule[i].date / 1000).format("yyyy-MM-DD");
                    let start = '';
                    let end = '';
                    if (schedule[i].timeType == 'T1') {
                        start = '08:00:00';
                        end = '09:00:00';
                    }
                    if (schedule[i].timeType == 'T2') {
                        start = '09:00:00';
                        end = '10:00:00';
                    }
                    if (schedule[i].timeType == 'T3') {
                        start = '10:00:00';
                        end = '11:00:00';
                    }
                    if (schedule[i].timeType == 'T4') {
                        start = '11:00:00';
                        end = '12:00:00';
                    }
                    if (schedule[i].timeType == 'T5') {
                        start = '13:00:00';
                        end = '14:00:00';
                    }
                    if (schedule[i].timeType == 'T6') {
                        start = '14:00:00';
                        end = '15:00:00';
                    }
                    if (schedule[i].timeType == 'T7') {
                        start = '15:00:00';
                        end = '16:00:00';
                    }
                    if (schedule[i].timeType == 'T8') {
                        start = '16:00:00';
                        end = '17:00:00';
                    }
                    obSchedule.title = `${schedule[i].doctorData.firstName}-${schedule[i].RoomScheduleData.name}`;
                    obSchedule.start = `${date}T${start}`;
                    obSchedule.end = `${date}T${end}`;
                
                    arr.push(obSchedule);
                }
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: arr,
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}

let getTotalDoctorService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            let total = await db.User.count({
                where: { 
                    roleId: "R2",
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


let handCountDoctorInClinicByDoctorService = (doctorInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })
            } else {
                let doctor = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: doctorInput,
                    }
                })
                let data = 0
                if (doctor) {
                    data = await db.Doctor_Info.count({
                        where: {
                            clinicId: doctor.clinicId
                        }
                    })
                }

                resolve({
                    errCode: 0,
                    data
                })
            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}



let checkBookingPatientService =  (doctorId, date) => {
    return new Promise( async (resolve, reject) => {
        try {
            if (!doctorId | !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let flag = false;
                //yes => no schedule date, clinic
                let schedule = await db.Booking.findAll({
                    where: {
                        date: date
                    },
                    include: [
                        { model: db.User, as: 'bookingDoctorData',
                       
                         where : {
                            id: doctorId
                         }

                        },

                    ],
                    raw: true,
                    nest: true,

                })
                if(schedule && schedule.length > 0) {
                   flag = true
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: flag,
                })
            }
        } catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}


module.exports = {
    getTopDoctorHomeServer: getTopDoctorHomeServer,
    getAllDoctorsServer: getAllDoctorsServer,
    createDetailInfoDoctorService: createDetailInfoDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    getInfoDoctorByIdMarkdownService: getInfoDoctorByIdMarkdownService,
    bulkCreateScheduleService: bulkCreateScheduleService,
    getScheduleByDateService: getScheduleByDateService,
    getExtraDoctorInfoByIdService: getExtraDoctorInfoByIdService,
    getProfileDoctorInfoByIdService: getProfileDoctorInfoByIdService,
    getPatientByDateDoctorService: getPatientByDateDoctorService,
    postSendEmailPatientService: postSendEmailPatientService,
    getTotalDoctorService: getTotalDoctorService,
    getScheduleByIdService: getScheduleByIdService,
    handCountDoctorInClinicByDoctorService: handCountDoctorInClinicByDoctorService,
    postCancelEmailPatientService: postCancelEmailPatientService,
    checkBookingPatientService :checkBookingPatientService,
}

