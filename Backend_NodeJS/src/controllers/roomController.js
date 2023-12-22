import roomService from "../services/roomService";

let handleCreateNewRoom = async (req, res) => {
      try {

            let data = await roomService.handleCreateNewRoomService(req.body);
            return res.status(200).json(
                  data
            );
      } catch (e) {
            console.log('error code server', e);
            return res.status(200).json({
                  errCode: -1,
                  errMessage: 'error server'
            })
      }
}


let handleEditRoom = async (req, res) => {
      try {
            let data = await roomService.handleEditRoomService(req.body);
            return res.status(200).json(
                  data
            );
      } catch (e) {
            console.log('error code server', e);
            return res.status(200).json({
                  errCode: -1,
                  errMessage: 'error server'
            })
      }
}



let getAllRoom = async (req, res) => {
      try {
            let id = req.query.id;
            let clinic = req.query.clinic;

            let data = await roomService.getAllRoomService(id, clinic);
            return res.status(200).json(
                  data
            );
      } catch (e) {
            console.log('error code server', e);
            return res.status(200).json({
                  errCode: -1,
                  errMessage: 'error server'
            })
      }
}


let getScheduleRoomByDate = async (req, res) => {
      try {
          let info = await roomService.getScheduleRoomByDateService(req.query.clinic, req.query.date);
          return res.status(200).json(info);
        }catch(e) {
         console.log(e);
              return res.status(200).json({
                  errCode: -1,
                  errMessage: 'Error from server!'
              })
        }
   }


   let handleBulkCreateBusinessHours = async (req, res) => {
      try {

            let data = await roomService.handleBulkCreateBusinessHoursService(req.body);
            return res.status(200).json(
                  data
            );
      } catch (e) {
            console.log('error code server', e);
            return res.status(200).json({
                  errCode: -1,
                  errMessage: 'error server'
            })
      }
}

let getScheduleBusinessHoursById = async (req, res) => {
      try {
          let info = await roomService.getScheduleBusinessHoursByIdService(req.query.clinicId);
          return res.status(200).json(info);
        }catch(e) {
         console.log(e);
              return res.status(200).json({
                  errCode: -1,
                  errMessage: 'Error from server!'
              })
        }
   }


   
let getRoomStatusByDate = async (req, res) => {
      try {
          let info = await roomService.getRoomStatusByDateService(req.query.date, req.query.status, req.query.clinic);
          return res.status(200).json(info);
        }catch(e) {
         console.log(e);
              return res.status(200).json({
                  errCode: -1,
                  errMessage: 'Error from server!'
              })
        }
   }


   let handleChooseByDate = async (req, res) => {
      try {
          let info = await roomService.handleChooseByDateService(req.query.clinic ,req.query.date, req.query.room);
          return res.status(200).json(info);
        }catch(e) {
         console.log(e);
              return res.status(200).json({
                  errCode: -1,
                  errMessage: 'Error from server!'
              })
        }
   }

   let checkScheduleDoctor = async (req, res) => {
      try {
          let info = await roomService.checkScheduleDoctorService(req.query.clinic ,req.query.date, req.query.room);
          return res.status(200).json(info);
        }catch(e) {
         console.log(e);
              return res.status(200).json({
                  errCode: -1,
                  errMessage: 'Error from server!'
              })
        }
   }

module.exports = {
      handleCreateNewRoom: handleCreateNewRoom,
      handleEditRoom: handleEditRoom,
      getAllRoom: getAllRoom,
      getScheduleRoomByDate: getScheduleRoomByDate,
      handleBulkCreateBusinessHours : handleBulkCreateBusinessHours,
      getScheduleBusinessHoursById: getScheduleBusinessHoursById,
      getRoomStatusByDate: getRoomStatusByDate,
      handleChooseByDate: handleChooseByDate,
      checkScheduleDoctor: checkScheduleDoctor,
}

