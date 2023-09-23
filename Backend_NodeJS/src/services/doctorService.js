import db from "../models/index";
require('dotenv').config();
import _, { reject } from "lodash";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;
let getTopDoctorHomeServer = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
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


let getAllDoctorsServer = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctors = await db.User.findAll({
                where: {
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password', 'image']
                }
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

let createDetailInfoDoctorService = (inputData) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!inputData.doctorId || !inputData.contentHTML
                || !inputData.contentMarkdown || !inputData.action
                || !inputData.selectedPrice || !inputData.selectedPayment
                || !inputData.selectedProvince || !inputData.nameClinic
                || !inputData.addressClinic || !inputData.note) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input data'
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
                        doctorId: inputData.doctorId,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    })
                } else {
                    //edit doctor
                    doctor.priceId = inputData.selectedPrice;
                    doctor.provinceId = inputData.selectedProvince;
                    doctor.paymentId = inputData.selectedPayment;
                    doctor.note = inputData.note;
                    doctor.nameClinic = inputData.nameClinic;
                    doctor.addressClinic = inputData.addressClinic;

                    await doctor.save();
                }


                resolve({
                    errCode: 0,
                    errMessage: "Create info detail doctor success"
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
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
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
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
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

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
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
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },

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
      return new Promise( async (resolve, reject) => {
          try {
              if(!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
              }else {
                let infoDoctor = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputId,
                       
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: true,
                    nest: true,
                })

                if( !infoDoctor) infoDoctor = [];
                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: infoDoctor,
                })
              }
          }
          catch(e) {
            console.log('error: ', e);
            reject(e);
          }
      })
} 

let getProfileDoctorInfoByIdService  = (doctorId) => {
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
}

