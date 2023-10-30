import { raw } from "body-parser";
import db from "../models/index";
import { reject, remove } from "lodash";
import _ from "lodash";

let createNewPrescriptionService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.symptoms || !data.diagnosis
                || !data.listMedicine || !data.date || !data.dataBooking) {
                resolve({
                    errCode: 1,
                    errMessage: "Input parameter not.",
                });
            } else {

                let booking = await db.Booking.findOne({
                    where: {
                        patientId: data.dataBooking.patientId,
                        doctorId: data.dataBooking.doctorId,
                        date: data.date,
                        timeType: data.dataBooking.timeType,
                        statusId: 'S2',
                    },
                    raw: false,
                })


                if (booking) {
                    booking.statusId = 'S3';
                    await booking.save();
                }


                let prescription = await db.Prescription.create({
                    symptoms: data.symptoms,
                    diagnosis: data.diagnosis,
                    bookingId: booking.id,

                }
                );
                let pres = prescription.get({ plain: true })
                // console.log('pre', pres);

                let listMedicine = data.listMedicine;
                listMedicine.map(item => {
                    item.medicineId = item.id;
                    delete item.id;
                    delete item.name;
                    item.prescriptionId = pres.id;

                })



                await db.Detail_Prescription.bulkCreate(listMedicine);


                let presNew = await getPrescription(pres.id);

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                    prescription: presNew.prescription
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

let getPrescription = async (idInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!idInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'not input',
                })
            } else {

                let pres = await db.Prescription.findOne({
                    where: {
                        id: idInput
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.Booking,
                            attributes: {
                                exclude: ['createdAt', 'updatedAt'],
                            },
                            include: [
                                {
                                    model: db.Allcode, as: 'timeTypePatient',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.Allcode, as: 'statusData',
                                    attributes: ['valueEn', 'valueVi']
                                },
                                {
                                    model: db.User, as: 'userData',
                                    attributes: ['email', 'lastName', 'firstName', 'phoneNumber', 'gender', 'address', 'birthday']
                                },
                                {
                                    model: db.User, as: 'bookingDoctorData',
                                    attributes: ['email', 'lastName', 'firstName', 'phoneNumber']
                                },
                            ],

                        },

                    ],

                    raw: true,
                    nest: true,
                })

                // console.log('----------')
                // console.log('data', pres)
                // console.log('----------')

                let medicine = await db.Detail_Prescription.findAll({
                    where: {
                        prescriptionId: idInput

                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.Medicine, as: 'medicineData',
                            attributes: ['name']
                        },
                        {
                            model: db.Allcode, as: 'dosageData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'frequencyData',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],

                    raw: true,
                    nest: true,
                })

                // console.log('----------')
                // console.log('data medicine', medicine)
                // console.log('----------')

                resolve({
                    prescription: {
                        pres,
                        medicine,
                    },
                    errCode: 0,
                    errMessage: 'find prescription success',
                })
            }
        }
        catch (err) {
            reject(err);
        }
    })
}

let getPrescriptionByBookingIdService = (bookingIdInput) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!bookingIdInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Input parameter not.",
                });
            } else {

                let pres = await db.Prescription.findOne({
                    where: {
                        bookingId: bookingIdInput
                    },
                    raw: true,
                })
                

                let presNew = {};
                if (pres) {
                    presNew = await getPrescription(pres.id);

                }

                resolve({
                    prescription: presNew.prescription,
                    errCode: 0,
                    errMessage: "OK",

                });
            }
        } catch (err) {
            reject(err);
        }
    });
}

let getAllDetailPrescriptionByIdPres = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: 'not input',
                })
            } else {
                let medicine = await db.Detail_Prescription.findAll({
                    where: {
                        prescriptionId: inputId

                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    include: [
                        {
                            model: db.Medicine, as: 'medicineData',
                            attributes: ['name']
                        },
                        {
                            model: db.Allcode, as: 'dosageData',
                            attributes: ['valueEn', 'valueVi']
                        },
                        {
                            model: db.Allcode, as: 'frequencyData',
                            attributes: ['valueEn', 'valueVi']
                        }
                    ],

                    raw: true,
                    nest: true,
                })
                resolve({
                    medicine
                })
            }
        }
        catch (err) {
            reject(err);
        }
    });
}




let getAllPrescriptionByPatientIdService = async (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Not Input",
                })
            }
            else {
                let booking = await db.Booking.findAll({
                    where: {
                        patientId: inputId
                    },
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                })
                let arrPres = [];
                for (let i = 0; i < booking.length; i++) {
                    let presA = await getPrescriptionByBookingIdService(booking[i].id)
                    
                    if(!_.isEmpty(presA.prescription) ) {
                      arrPres.push(presA.prescription)  
                    }
                }

                resolve({
                    arrPres,
                    errCode: 0,
                    errMessage: "OK",
                });

            }

        } catch (e) {
            console.log('bog', e);
            resolve(e);
        }
    })
}

module.exports = {
    createNewPrescriptionService: createNewPrescriptionService,
    getPrescription: getPrescription,
    getAllPrescriptionByPatientIdService: getAllPrescriptionByPatientIdService,
    getAllDetailPrescriptionByIdPres: getAllDetailPrescriptionByIdPres,
    getPrescriptionByBookingIdService: getPrescriptionByBookingIdService
};
