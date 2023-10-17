import { raw } from "body-parser";
import db from "../models/index";


let getAllMedicinesService = (medicineId, formulary) => {
    return new Promise(async (resolve, reject) => {
        try {
             let medicines = "";
         
            if (medicineId === "ALL") {

                if (formulary === "ALL") {
                    medicines = await db.Medicine.findAll({
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    });
                } else if (formulary && formulary != "ALL") {
                    medicines = await db.Medicine.findAll({
                        where: {
                            formularyId: formulary,
                        },
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                    });
                }

            }


            if (medicineId && medicineId != "ALL") {

                medicines = await db.Medicine.findOne({
                    where: {
                        id: medicineId,
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                });
            }

            resolve(medicines);

        } catch (e) {
            reject(e);
        }
    });
};


let createNewMedicineService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.description || !data.uses || !data.using
                || !data.ingredient || !data.producer || !data.formularyId) {
                resolve({
                    errCode: 1,
                    errMessage: "Input parameter not.",
                });
            } else {

                await db.Medicine.create({
                    name: data.name,
                    description: data.description,
                    uses: data.uses,
                    using: data.using,
                    ingredient: data.ingredient,
                    producer: data.producer,
                    formularyId: data.formularyId,

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

// let deleteUser = (id) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             if (!id) {
//                 resolve({
//                     errCode: 3,
//                     errMessage: "Input parameter",
//                 });
//             } else {
//                 let user = await db.User.findOne({
//                     where: { id: id },
//                 });
//                 if (!user) {
//                     resolve({
//                         errCode: 2,
//                         errMessage: "The user isn's exist",
//                     });
//                 }
//                 if (user) {
//                     await db.User.destroy({
//                         where: { id: id },
//                     });
//                     resolve({
//                         errCode: 0,
//                         errMessage: "The user is deleted",
//                     });
//                 }
//             }

//         } catch (err) {
//             reject(err);
//         }
//     });
// };



let handleEditMedicineService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.formularyId || !data.name || !data.description
                || !data.uses || !data.using || !data.ingredient || !data.producer
            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                })
            } else {
                let medicine = await db.Medicine.findOne({
                    where: { id: data.id },
                    raw: false,
                });


                if (medicine) {
                    (medicine.name = data.name),
                        (medicine.description = data.description),
                        (medicine.uses = data.uses),
                        (medicine.using = data.using),
                        (medicine.ingredient = data.ingredient),
                        (medicine.producer = data.producer),
                        (medicine.formularyId = data.formularyId);


                    await medicine.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Update the medicine succeeds!",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "Medicine's not found",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};



module.exports = {
    createNewMedicineService: createNewMedicineService,
    getAllMedicinesService: getAllMedicinesService,
    // deleteUser: deleteUser,
    handleEditMedicineService: handleEditMedicineService,

};
