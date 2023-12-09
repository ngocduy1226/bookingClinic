import { reject } from "lodash";
import db from "../models/index";


let handleCreateNewSpecialtyService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.name 
                || !dataInput.descriptionHTML
                || !dataInput.descriptionMarkdown

            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let specialty = await db.Specialty.create({
                    name: dataInput.name,
                    descriptionHTML: dataInput.descriptionHTML,
                    descriptionMarkdown: dataInput.descriptionMarkdown,
                    image: dataInput.imageBase64,
                })
    
                resolve({
                    data: specialty,
                    errCode: 0,
                    errMessage: "Create specialty success!"
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let handleEditSpecialtyService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.name || !data.descriptionHTML || !data.descriptionMarkdown 

            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                })
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: data.id },
                    raw: false,
                });


                if (specialty) {
                    (specialty.name = data.name),
                    (specialty.image = data.imageBase64),

                        (specialty.descriptionMarkdown = data.descriptionMarkdown),
                        (specialty.descriptionHTML = data.descriptionHTML),
                        await specialty.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Update the specialty succeeds!",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "specialty's not found",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};


let getTopSpecialtyHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                where: {
                    delete: 0
                }
            })
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })

            }
            if (!data) data = {};

            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        }
        catch (e) {
            reject(e);
        }
    })
}

let getAllSpecialtyService = (status) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
                where: {
                    delete: status
                }
            })
            if (data && data.length > 0) {
                data.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                })

            }
            if (!data) data = {};

            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            })
        }
        catch (e) {
            reject(e);
        }
    })
}


let getDetailSpecialtyByIdService = (inputId, location)  => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId || !location) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })
            }else {
                let data = await db.Specialty.findOne({
                    where : {
                        id: inputId,
                    },
                    attributes: ['descriptionHTML', 'name', 'descriptionMarkdown'],
                })
                 
    
                if(!data) data = {};

                if(data) {
                    let doctorSpecialty = [];
                    if(location === "ALL") {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where : {
                                specialtyId : inputId,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where : {
                                specialtyId : inputId,
                                provinceId : location,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        })
                    }
                    data.doctorSpecialty = doctorSpecialty;
                }
                resolve({
                    errCode: 0,
                    errMessage: "Get detail success",
                    data
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}




let deleteSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!specialty) {
                    resolve({
                        errCode: 2,
                        errMessage: "The specialty isn's exist",
                    });
                }

                if (specialty) {
                    specialty.delete = 1
                    specialty.save();
  
                    let listDoctorInfo = await db.Doctor_Info.findAll({
                        where: {
                            specialtyId: id,
                        },
                        raw: false,
                    })

                    for (let i = 0; i < listDoctorInfo.length; i++) {
                         let doctor = await db.User.findOne({
                            where: {
                                id: listDoctorInfo[i].doctorId,
                            },
                            raw: false,
                         })
                        doctor.statusUser = 1;
                        doctor.save();
                    }

                    resolve({
                        errCode: 0,
                        errMessage: "The clinic is deleted",
                    });
                }
            }

        } catch (err) {
            reject(err);
        }
    });
};


let restoreSpecialty = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let specialty = await db.Specialty.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!specialty) {
                    resolve({
                        errCode: 2,
                        errMessage: "The specialty isn's exist",
                    });
                }
                if (specialty) {
                    specialty.delete = 0
                    specialty.save();

                    let listDoctorInfo = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: id,
                        },
                        raw: false,
                    })
                    
                    for (let i = 0; i < listDoctorInfo.length; i++) {
                         let doctor = await db.User.findOne({
                            where: {
                                id: listDoctorInfo[i].doctorId,
                            },
                            raw: false,
                         })
                        doctor.statusUser = 0;
                        doctor.save();
                    }


                    resolve({
                        errCode: 0,
                        errMessage: "The clinic is restored",
                    });
                }
            }

        } catch (err) {
            reject(err);
        }
    });
};




module.exports = {
    deleteSpecialty: deleteSpecialty,
    restoreSpecialty: restoreSpecialty,
    handleCreateNewSpecialtyService: handleCreateNewSpecialtyService,
    getTopSpecialtyHomeService: getTopSpecialtyHomeService,
    getAllSpecialtyService: getAllSpecialtyService,
    getDetailSpecialtyByIdService: getDetailSpecialtyByIdService,
    handleEditSpecialtyService: handleEditSpecialtyService,
}