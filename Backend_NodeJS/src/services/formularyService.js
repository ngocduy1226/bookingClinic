import { raw } from "body-parser";
import db from "../models/index";


let getAllFormulariesService = (formularyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let formularies = "";

            if (formularyId === "ALL") {

                formularies = await db.Formulary.findAll({
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                });

            }



            if (formularyId && formularyId != "ALL") {

                formularies = await db.Formulary.findOne({
                    where: {
                        id: formularyId,
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



module.exports = {
    handleCreateNewFormularyService: handleCreateNewFormularyService,
    getAllFormulariesService: getAllFormulariesService,
    // deleteUser: deleteUser,
    handleEditFormularyService: handleEditFormularyService,

};
