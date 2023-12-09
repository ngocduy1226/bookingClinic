import { raw } from "body-parser";
import db from "../models/index";


let getAllFormulariesService = (formulary) => {
    return new Promise(async (resolve, reject) => {
        try {
            let formularies = "";

            if (formulary.id === "ALL") {

                formularies = await db.Formulary.findAll({
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    where: {
                        status: formulary.status
                    }
                });

            }



            if (formulary.id && formulary.id != "ALL") {

                formularies = await db.Formulary.findOne({
                    where: {
                        id: formulary.id,
                        status: formulary.status
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                });
            }

            resolve(formularies);

        } catch (e) {
            reject(e);
        }
    });
};


let handleCreateNewFormularyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.name || !data.description) {
                resolve({
                    errCode: 1,
                    errMessage: "Input parameter not.",
                });
            } else {

                await db.Formulary.create({
                    name: data.name,
                    description: data.description,


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



let handleEditFormularyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.name || !data.description

            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                })
            } else {
                let formulary = await db.Formulary.findOne({
                    where: { id: data.id },
                    raw: false,
                });


                if (formulary) {
                    (formulary.name = data.name),
                        (formulary.description = data.description),

                        await formulary.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Update the formulary succeeds!",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "Formulary's not found",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};


let deleteFormulary = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let formulary = await db.Formulary.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!formulary) {
                    resolve({
                        errCode: 2,
                        errMessage: "The user isn's exist",
                    });
                }
                
                if (formulary) {
                    formulary.status = 1
                    formulary.save();
                   
                    let listMedicine = await db.Medicine.findAll({
                        where: {
                            formularyId: id,
                        },
                        raw: false,
                    })

  
                    for(let i = 0; i< listMedicine.length; i++) {
                        listMedicine[i].status = 1;
                        listMedicine[i].save();
                    }

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


let restoreFormulary = (id) => {
    console.log('id', id)
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let formulary = await db.Formulary.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!formulary) {
                    resolve({
                        errCode: 2,
                        errMessage: "The medicine isn's exist",
                    });
                }
                if (formulary) {
                    formulary.status = 0
                    formulary.save();
                   
                    let listMedicine = await db.Medicine.findAll({
                        where: {
                            formularyId: id,
                        },
                        raw: false,
                    })

  
                    for(let i = 0; i< listMedicine.length; i++) {
                        listMedicine[i].status = 0;
                        listMedicine[i].save();
                    }


                    resolve({
                        errCode: 0,
                        errMessage: "The medicine is restored",
                    });
                }
            }

        } catch (err) {
            reject(err);
        }
    });
};


module.exports = {
    handleCreateNewFormularyService: handleCreateNewFormularyService,
    getAllFormulariesService: getAllFormulariesService,
    deleteFormulary: deleteFormulary,
    handleEditFormularyService: handleEditFormularyService,
    restoreFormulary: restoreFormulary,
};
