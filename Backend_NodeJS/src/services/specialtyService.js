import { reject } from "lodash";
import db from "../models/index";


let handleCreateNewSpecialtyService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.name || !dataInput.imageBase64
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
                console.log('cệ', dataInput.imageBase64);
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


let getTopSpecialtyHomeService = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
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

let getAllSpecialtyService = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll({
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

module.exports = {
    handleCreateNewSpecialtyService: handleCreateNewSpecialtyService,
    getTopSpecialtyHomeService: getTopSpecialtyHomeService,
    getAllSpecialtyService: getAllSpecialtyService,
    getDetailSpecialtyByIdService: getDetailSpecialtyByIdService
}