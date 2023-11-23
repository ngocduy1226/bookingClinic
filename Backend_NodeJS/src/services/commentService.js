import { raw } from "body-parser";
import db from "../models/index";
import comment from "../models/comment";


let handleGetAllCommentByDoctorIdService = (doctorId, status) => {

      return new Promise(async (resolve, reject) => {
            try {

                  if (!doctorId) {
                        resolve({
                              errCode: 1,
                              errMessage: "Missing input"
                        })

                  } else {

                        let comments = "";
                        if (doctorId === "ALL") {
                              comments = await db.Comment.findAll({
                                    order: [['createdAt', 'DESC']],
                                    attributes: {
                                          exclude: ["createdAt", "updatedAt"],
                                    },
                                    include: [
                                          {
                                                model: db.Doctor_Info, as: 'infoDoctorData',
                                                attributes: ['doctorId'],
                                                include: [
                                                      {
                                                            model: db.User,
                                                            attributes: ['firstName', 'lastName']
                                                      },
                                                ]

                                          },

                                          { model: db.User, as: 'userCommentData', attributes: ['lastName', 'firstName', 'email'] },

                                    ],
                                    raw: true,
                                    nest: true,
                                    attributes: {
                                          exclude: ["createdAt", "updatedAt"],
                                    },
                              });

                        }



                        if (doctorId != "ALL" && status != '') {
                              comments = await db.Comment.findAll({
                                    where: {
                                          infoDoctorId: doctorId,
                                          statusId: status,
                                    },
                                    order: [['createdAt', 'DESC']],
                                    include: [
                                          {
                                                model: db.Doctor_Info, as: 'infoDoctorData',
                                                attributes: ['doctorId'],
                                                include: [
                                                      {
                                                            model: db.User,
                                                            attributes: ['firstName', 'lastName']
                                                      },
                                                ]

                                          },

                                          { model: db.User, as: 'userCommentData', attributes: ['lastName', 'firstName', 'image'] },

                                    ],
                                    raw: true,
                                    nest: true,
                                    attributes: {
                                          exclude: ["createdAt", "updatedAt"],
                                    },
                              });


                              if (comments && comments.length > 0) {
                                    comments.map(item => {
                                          if (item.userCommentData.image) {
                                                item.userCommentData.image = new Buffer(item.userCommentData.image, 'base64').toString('binary');
                                          }
                                          return item;
                                    })
                              }
                        }

                        if (comments && comments.length > 0) {
                              comments.map(item => {
                                    let date = getDifferentTime(item.time);
                                    item.different = date;

                                    return item;
                              })

                        }
                        resolve({
                              errCode: 0,
                              comments
                        });
                  }

            } catch (e) {
                  reject(e);
            }
      });
};

let getDifferentTime = (t2) => {


      const t1 = new Date().getTime();
      let ts = (t1 - t2) / 1000;

      var d = Math.floor(ts / (3600 * 24));
      var h = Math.floor(ts % (3600 * 24) / 3600);
      var m = Math.floor(ts % 3600 / 60);
      var s = Math.floor(ts % 60);
      var i = ''
      if (d > 0) {
            i = d + ' ngày trước'
      } else {
            if (h > 0) {
                  i = h + ' giờ trước'
            } else {
                  i = m + ' phút trước'
            }
      }
      i === '0 phút trước' ? i = 'Vừa xong' : i

      return i;



}

let handleGetAllCommentService = (doctorId, currentDate) => {

      return new Promise(async (resolve, reject) => {
            try {

                  if (!currentDate || !doctorId) {
                        resolve({
                              errCode: 1,
                              errMessage: "Missing input"
                        })

                  } else {
                        //   moment(new Date()).startOf('day').valueOf(),
                        let comments = "";
                        if (doctorId === "ALL") {
                              comments = await db.Comment.findAll({
                                    where: {
                                          date: currentDate,
                                    },
                                    order: [['createdAt', 'DESC']],
                                    attributes: {
                                          exclude: ["createdAt", "updatedAt"],
                                    },
                                    include: [
                                          {
                                                model: db.Doctor_Info, as: 'infoDoctorData',
                                                attributes: ['doctorId'],
                                                include: [
                                                      {
                                                            model: db.User,
                                                            attributes: ['firstName', 'lastName']
                                                      },
                                                ]

                                          },

                                          { model: db.User, as: 'userCommentData', attributes: ['lastName', 'firstName', 'email'] },

                                    ],
                                    raw: true,
                                    nest: true,
                                    attributes: {
                                          exclude: ["createdAt", "updatedAt"],
                                    },
                              });

                        }
                        if (doctorId != 'ALL') {
                              comments = await db.Comment.findAll({
                                    where: {
                                          infoDoctorId: doctorId,
                                          date: currentDate,
                                    },
                                    order: [['createdAt', 'DESC']],
                                    include: [
                                          {
                                                model: db.Doctor_Info, as: 'infoDoctorData',
                                                attributes: ['doctorId'],
                                                include: [
                                                      {
                                                            model: db.User,
                                                            attributes: ['firstName', 'lastName']
                                                      },
                                                ]

                                          },

                                          { model: db.User, as: 'userCommentData', attributes: ['lastName', 'firstName', 'email'] },

                                    ],
                                    raw: true,
                                    nest: true,
                                    attributes: {
                                          exclude: ["createdAt", "updatedAt"],
                                    },
                              });


                        }

                        if (comments && comments.length > 0) {
                              comments.map(item => {
                                    let date = getDifferentTime(item.time);
                                    item.different = date;

                                    return item;
                              })

                        }

                        resolve({
                              errCode: 0,
                              comments
                        });
                  }

            } catch (e) {
                  reject(e);
            }
      });
};

let handleCreateNewCommentService = (data) => {
      return new Promise(async (resolve, reject) => {
            try {

                  if (!data.doctorId || !data.email || !data.comment || !data.date || !data.time) {
                        resolve({
                              errCode: 1,
                              errMessage: "Input parameter not.",
                        });
                  } else {
                        let user = await db.User.findOrCreate({
                              where: { email: data.email },
                              defaults: {
                                    email: data.email,
                                    roleId: 'R3',
                                    positionId: 'P5',

                              }
                        })

                        if (user && user[0]) {
                              let comment = await db.Comment.create({
                                    patientId: user[0].id,
                                    statusId: 'S1',
                                    infoDoctorId: data.doctorId,
                                    content: data.comment,
                                    time: data.time,
                                    date: data.date,
                              })
                        }

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




let handShowHideCommentService = (commentId, status) => {
      return new Promise(async (resolve, reject) => {
            try {

                  if (!commentId || !status) {
                        resolve({
                              errCode: 2,
                              errMessage: "Missing parameter"
                        })
                  } else {
                        let comment = await db.Comment.findOne({
                              where: { id: commentId },
                              raw: false,
                        });
                        if (comment) {
                              if (comment.statusId === 'S1') {
                                    (comment.statusId = 'S2')

                              } else {
                                    (comment.statusId = 'S1')

                              }
                              await comment.save();

                              resolve({
                                    errCode: 0,
                                    errMessage: "Update the Comment succeeds!",
                              });
                        } else {
                              resolve({
                                    errCode: 1,
                                    errMessage: "Comment's not found",
                              });
                        }
                  }
            } catch (err) {
                  reject(err);
            }
      });
};


let handCountCommentByDoctorService = (doctor, status) => {
      return new Promise(async (resolve, reject) => {
            try {
                  if (!doctor || !status) {
                        resolve({
                              errCode: 1,
                              errMessage: "Missing input"
                        })
                  } else {
                        let data = 0;
                        if (status === 'ALL') {
                              data = await db.Comment.count({
                                    where: {
                                          infoDoctorId: doctor
                                    }
                              });
                        } else {
                              if (doctor === 'ALL') {
                                    data = await db.Comment.count({
                                          where: {
                                                statusId: status
                                          }
                                    });

                              } else {
                                    data = await db.Comment.count({
                                          where: {
                                                infoDoctorId: doctor,
                                                statusId: status
                                          }
                                    });
                              }

                        }


                        resolve({
                              errCode: 0,
                              data,
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
      handleCreateNewCommentService: handleCreateNewCommentService,
      handleGetAllCommentService: handleGetAllCommentService,
      handShowHideCommentService: handShowHideCommentService,
      handleGetAllCommentByDoctorIdService: handleGetAllCommentByDoctorIdService,
      getDifferentTime: getDifferentTime,
      handCountCommentByDoctorService: handCountCommentByDoctorService,
};
