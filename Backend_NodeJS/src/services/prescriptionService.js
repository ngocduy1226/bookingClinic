import { raw } from "body-parser";
import db from "../models/index";
import { reject } from "lodash";


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

let getPrescription = (idInput) => {
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

                console.log('----------')
                console.log('data', pres)
                console.log('----------')

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

                console.log('----------')
                console.log('data', medicine)
                console.log('----------')

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
        catch (e) {

        }
    })
}


module.exports = {
    createNewPrescriptionService: createNewPrescriptionService,
    getPrescription: getPrescription

};
