import { reject } from "lodash";
import db from "../models/index";


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


let getTopClinicHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
                limit: limitInput,
                order: [['createdAt', 'DESC']],
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

let getAllClinicService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Clinic.findAll({
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


let getDetailClinicByIdService = (inputId)  => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputId ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })
            }else {
                let data = await db.Clinic.findOne({
                    where : {
                        id: inputId,
                    },
                    attributes: ['descriptionHTML', 'name', 'address', 'descriptionMarkdown', 'image', 'imageSub'],
                })
                 
    
                if(!data) data = {};

                if(data) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                    data.imageSub = new Buffer(data.imageSub, 'base64').toString('binary');
                    let doctorClinic = [];
                   
                        doctorClinic = await db.Doctor_Info.findAll({
                            where : {
                                clinicId : inputId,
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

module.exports = {
    handleCreateNewClinicService: handleCreateNewClinicService,
    getTopClinicHomeService: getTopClinicHomeService,
     getAllClinicService: getAllClinicService,
    getDetailClinicByIdService: getDetailClinicByIdService
}