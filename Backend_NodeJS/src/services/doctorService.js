import db from "../models/index";

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

            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing input data'
                })
            } else {
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
module.exports = {
    getTopDoctorHomeServer: getTopDoctorHomeServer,
    getAllDoctorsServer: getAllDoctorsServer,
    createDetailInfoDoctorService: createDetailInfoDoctorService,
    getDetailDoctorByIdService: getDetailDoctorByIdService,
    getInfoDoctorByIdMarkdownService: getInfoDoctorByIdMarkdownService,
}

