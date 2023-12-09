import { map, reject } from "lodash";
import db from "../models/index";
import doctorService from '../services/doctorService';

let handleCreateNewClinicService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.name || !dataInput.imageBase64
                || !dataInput.imageBase64Sub
                || !dataInput.descriptionHTML
                || !dataInput.descriptionMarkdown
                || !dataInput.address

            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let Clinic = await db.Clinic.create({
                    name: dataInput.name,
                    address: dataInput.address,
                    descriptionHTML: dataInput.descriptionHTML,
                    descriptionMarkdown: dataInput.descriptionMarkdown,
                    image: dataInput.imageBase64,
                    imageSub: dataInput.imageBase64Sub,
                })
                resolve({
                    data: Clinic,
                    errCode: 0,
                    errMessage: "Create Clinic success!"
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let handleEditClinicService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.name || !data.address || !data.descriptionHTML || !data.descriptionMarkdown

            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                })
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: data.id },
                    raw: false,
                });


                if (clinic) {
                    (clinic.name = data.name),
                        (clinic.address = data.address),
                        (clinic.image = data.imageBase64),
                        (clinic.imageSub = data.imageBase64Sub),
                        (clinic.descriptionMarkdown = data.descriptionMarkdown),
                        (clinic.descriptionHTML = data.descriptionHTML),
                        await clinic.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Update the clinic succeeds!",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "clinic's not found",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};


let getTopClinicHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
                where: {
                    status: 0
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

let getAllClinicService = (statusInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                where: {
                    status: statusInput
                },
                raw: false
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


let getDetailClinicByIdService = (inputId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })
            } else {
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId,
                    },
                    attributes: ['descriptionHTML', 'name', 'address', 'descriptionMarkdown', 'image', 'imageSub'],
                })


                if (!data) data = {};

                if (data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                    data.imageSub = new Buffer(data.imageSub, 'base64').toString('binary');
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: inputId,
                        },
                        attributes: ['doctorId'],
                    })

                    data.doctorClinic = doctorClinic;
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


let getScheduleClinicByIdService = (inputArrId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputArrId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })
            } else {
                let listAll = [];
                for (let i = 0; i < inputArrId.length; i++) {

                    let schedule = await doctorService.getScheduleByIdService(inputArrId[i])
                    if (schedule.errCode === 0) {
                        let list = [];
                        let doctor = schedule.data;
                        list.push(doctor);
                        list.push({
                            textColor: 'black',
                            color: 'yellow',
                        })

                        listAll.push(list);
                    }

                }

                resolve({
                    errCode: 0,
                    errMessage: "Get detail success",
                    listAll
                })
            }
        }
        catch (e) {
            reject(e);
        }
    })
}



let getTotalClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = {};
            let total = await db.Clinic.count({
                // where: { roleId: "R3" },
            });
            res.errCode = 0;
            res.data = total;
            resolve(res);


        } catch (e) {
            reject(e);
        }
    });
};




let deleteClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage: "The clinic isn's exist",
                    });
                }

                if (clinic) {
                    clinic.status = 1
                    clinic.save();

                    let listRoom = await db.Room.findAll({
                        where: {
                            clinicId : id
                        },
                        raw: false,
                    })

                    for(let j = 0; j < listRoom.length ; j ++) {
                        listRoom[j].delete = 1;
                        listRoom[j].save();
                    }
                      
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


let restoreClinic = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 3,
                    errMessage: "Input parameter",
                });
            } else {
                let clinic = await db.Clinic.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!clinic) {
                    resolve({
                        errCode: 2,
                        errMessage: "The clinic isn's exist",
                    });
                }
                if (clinic) {
                    clinic.status = 0
                    clinic.save();

                    let listRoom = await db.Room.findAll({
                        where: {
                            clinicId : id
                        },
                        raw: false,
                    })

                    for(let j = 0; j < listRoom.length ; j ++) {
                        listRoom[j].delete = 0;
                        listRoom[j].save();
                    }
    

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
    handleCreateNewClinicService: handleCreateNewClinicService,
    handleEditClinicService: handleEditClinicService,
    getTopClinicHomeService: getTopClinicHomeService,
    getAllClinicService: getAllClinicService,
    getDetailClinicByIdService: getDetailClinicByIdService,
    getScheduleClinicByIdService: getScheduleClinicByIdService,
    getTotalClinicService: getTotalClinicService,
    deleteClinic: deleteClinic,
    restoreClinic: restoreClinic,

}