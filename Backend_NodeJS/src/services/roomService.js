
import { map, reject } from "lodash";
import db from "../models/index";
import _ from "lodash";
import moment from "moment";


let handleCreateNewRoomService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.name
                || !dataInput.description
                || !dataInput.clinicId

            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing input"
                })

            } else {
                let Room = await db.Room.create({
                    name: dataInput.name,
                    clinicId: dataInput.clinicId,
                    description: dataInput.description,

                })
                resolve({
                    data: Room,
                    errCode: 0,
                    errMessage: "Create Room success!"
                })

            }
        }
        catch (e) {
            reject(e);
        }
    })
}

let handleEditRoomService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.name || !data.clinicId || !data.description

            ) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameter"
                })
            } else {
                let Room = await db.Room.findOne({
                    where: { id: data.id },
                    raw: false,
                });


                if (Room) {
                    (Room.name = data.name),
                        (Room.clinicId = data.clinicId),
                        (Room.image = data.imageBase64),
                        (Room.description = data.description),

                        await Room.save();

                    resolve({
                        errCode: 0,
                        errMessage: "Update the Room succeeds!",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "Room's not found",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};



let getAllRoomService = (roomId, clinic) => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = "";

            if (roomId === "ALL") {

                if (clinic === "ALL") {
                    data = await db.Room.findAll({
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [
                            {
                                model: db.Clinic, as: 'roomClinicData',
                                attributes: ['name', 'id']
                            },
                        ],
                        raw: false,
                        nest: true,
                    });
                } else if (clinic && clinic != "ALL") {
                    data = await db.Room.findAll({
                        where: {
                            clinicId: clinic,
                        },
                        attributes: {
                            exclude: ["createdAt", "updatedAt"],
                        },
                        include: [
                            {
                                model: db.Clinic, as: 'roomClinicData',
                                attributes: ['name', 'id']
                            },
                        ]
                        ,
                        raw: false,
                        nest: true,
                    });
                }

            }


            if (roomId && roomId != "ALL") {

                data = await db.Room.findOne({
                    where: {
                        id: roomId,
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                });
            }

            resolve({
                errCode: 0,
                errMessage: 'Ok',
                data
            });

        } catch (e) {
            reject(e);
        }
    });
};


let getScheduleRoomByDateService = (clinicId, date) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let schedule = await db.Business_Hours.findAll({
                    where: {
                        clinicId: clinicId,
                        date: date,
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeHourData', attributes: ['valueEn', 'valueVi'] },

                        { model: db.Clinic, as: 'clinicHoursData', attributes: ['name'] },

                    ],
                    raw: true,
                    nest: true,
                })

                if (!schedule) schedule = [];

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: schedule,
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}


let handleBulkCreateBusinessHoursService = (dataInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataInput.arrSchedule || !dataInput.clinicId || !dataInput.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required schedule data"
                })
            } else {
                let schedule = dataInput.arrSchedule;

                let exiting = await db.Business_Hours.findAll({
                    where: { clinicId: dataInput.clinicId, date: dataInput.formatedDate },
                    attributes: ['timeType', 'date', 'clinicId'],
                    raw: true,
                });

                //compare different
                let toCreate = _.differenceWith(schedule, exiting, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;

                });

                let toDelete = _.differenceWith(exiting, schedule, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                let rooms = [];
                if (toCreate && toCreate.length > 0) {
                    console.log('create', toCreate);
                    await db.Business_Hours.bulkCreate(toCreate);

                    for (let x = 0; x < toCreate.length; x++) {
                        rooms = await db.Room.findAll({
                            where: {
                                clinicId: toCreate[x].clinicId,

                            },
                            attributes: ['name', 'id'],
                            raw: true,

                        });

                        for (let i = 0; i < rooms.length; i++) {
                            await db.Detail_Room.create({
                                date: toCreate[x].date,
                                statusId: 'SR1',
                                roomId: rooms[i].id,
                                timeType: toCreate[x].timeType,
                            })
                        }
                    }

                }

                if (toDelete && toDelete.length > 0) {
                    console.log('delete', toDelete);
                    toDelete.map(async item => {
                        await db.Business_Hours.destroy({
                            where: {
                                timeType: item.timeType,
                                date: item.date,
                                clinicId: item.clinicId,
                            }

                        })


                        return item
                    })


                    for (let x = 0; x < toDelete.length; x++) {

                        rooms = await db.Room.findAll({
                            where: {
                                clinicId: toDelete[x].clinicId,

                            },
                            attributes: ['name', 'id'],
                            raw: true,

                        });
                        for (let i = 0; i < rooms.length; i++) {
                            await db.Detail_Room.destroy({
                                where: {
                                    date: toDelete[x].date,
                                    statusId: 'SR1',
                                    roomId: rooms[i].id,
                                    timeType: toDelete[x].timeType,
                                }

                            })
                        }
                    }

                }
                resolve({
                    errCode: 0,
                    errMessage: 'OK',
                })

            }
        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    });
}


let getScheduleBusinessHoursByIdService = (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let schedule = await db.Business_Hours.findAll({
                    where: {
                        clinicId: clinicId,

                    },
                    include: [
                        {
                            model: db.Allcode, as: 'timeTypeHourData',
                            attributes: ['valueEn', 'valueVi'],
                        },
                        { model: db.Clinic, as: 'clinicHoursData', attributes: ['name'] },

                    ],
                    raw: true,
                    nest: true,
                })

                if (!schedule) schedule = [];

                // {
                //     title: 'BCH237',
                //     start: '2023-10-29T09:30:00',
                //     end: '2023-10-29T14:30:00',

                //   },
                let arr = [];
                for (let i = 0; i < schedule.length; i++) {
                    let obSchedule = {}
                    let date = moment.unix(+ schedule[i].date / 1000).format("yyyy-MM-DD");
                    let start = '';
                    let end = '';
                    if (schedule[i].timeType == 'T1') {
                        start = '08:00:00';
                        end = '09:00:00';
                    }
                    if (schedule[i].timeType == 'T2') {
                        start = '09:00:00';
                        end = '10:00:00';
                    }
                    if (schedule[i].timeType == 'T3') {
                        start = '10:00:00';
                        end = '11:00:00';
                    }
                    if (schedule[i].timeType == 'T4') {
                        start = '11:00:00';
                        end = '12:00:00';
                    }
                    if (schedule[i].timeType == 'T5') {
                        start = '13:00:00';
                        end = '14:00:00';
                    }
                    if (schedule[i].timeType == 'T6') {
                        start = '14:00:00';
                        end = '15:00:00';
                    }
                    if (schedule[i].timeType == 'T7') {
                        start = '15:00:00';
                        end = '16:00:00';
                    }
                    if (schedule[i].timeType == 'T8') {
                        start = '16:00:00';
                        end = '17:00:00';
                    }
                    obSchedule.title = `${schedule[i].clinicHoursData.name} `;
                    obSchedule.start = `${date}T${start}`;
                    obSchedule.end = `${date}T${end}`;

                    arr.push(obSchedule);
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: arr,
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}




let getRoomStatusByDateService = (date, status, clinic) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!status || !date || !clinic) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let room = await db.Room.findAll({
                    where: {
                        clinicId: clinic,
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    include: [
                        //  { model: db.Allcode, as: 'timeTypeHourData', attributes: ['valueEn', 'valueVi'] },

                        {
                            model: db.Detail_Room, as: 'DetailRoomData',
                            where: {
                                statusId: status,
                                date: date,
                            },
                            attributes: {
                                exclude: ["createdAt", "updatedAt"],
                            },
                        },

                    ],
                    raw: true,
                    nest: true,
                })

                if (!room) room = [];
                if (room && room.length > 0) { 
             
                    for (let i = 0; i < room.length; i++) {
                        
                        for (let j = 0; j < room.length; j++) {
                           
                            if (room[i] && room[j] && room[i].id === room[j].id) {
                                room.pop(room[i])
                            }
                        }


                    }
                }


                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    data: room,
                })

            }

        }
        catch (e) {
            console.log('error: ', e);
            reject(e);
        }
    })
}



let handleChooseByDateService = (data) => {
    console.log('data', data);
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.status || !data.date || !data.roomId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter schedule data"
                })
            } else {
                let room = await db.Detail_Room.findAll({
                    where: {
                        roomId: data.roomId,
                        date: data.date,
                        timeType: data.timeType,
                    },
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    raw: false,
                })

                if (!room) room = [];

                if (data.status === 'SR1') {
                    for (let i = 0; i < room.length; i++) {

                        room[i].statusId = 'SR2';
                        room[i].save();

                    }

                } else {
                    for (let i = 0; i < room.length; i++) {

                        room[i].statusId = 'SR1';
                        room[i].save();

                    }
                }

                resolve({
                    errCode: 0,
                    errMessage: 'Ok',
                    //data: room,
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
    handleCreateNewRoomService: handleCreateNewRoomService,
    handleEditRoomService: handleEditRoomService,
    getAllRoomService: getAllRoomService,
    getScheduleRoomByDateService: getScheduleRoomByDateService,
    handleBulkCreateBusinessHoursService: handleBulkCreateBusinessHoursService,
    getScheduleBusinessHoursByIdService: getScheduleBusinessHoursByIdService,
    getRoomStatusByDateService: getRoomStatusByDateService,
    handleChooseByDateService: handleChooseByDateService,
}