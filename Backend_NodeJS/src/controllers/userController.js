
import { Association } from "sequelize";
import userService from "../services/userService";


let handleLogin = async (req, res) => {
      let email = req.body.email;
      let password = req.body.password;
   
      if(!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message : 'Invalid email or password',
        })
        
      } 
     
     let userData = await userService.handleUserLogin(email, password); 
     return res.status(200).json({
         errCode: userData.errCode,
         message: userData.errMessage,
         user: userData.user ? userData.user : {}, 
     })
}


let handleGetAllUser = async (req, res) => {
    let id = req.query.userId;
    let status = req.query.status;
    // id => user(id)
    // all => users
    if(!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: 'Missing required parameters',
                users: [],
            })
        }
    let users = await userService.getAllUsers({
        userId: id,
        status:status
    });

    return res.status(200).json({
        errCode: 0,
        errMessage: 'Ok',
        users,
    })
}

let handleCreateNewUser = async (req, res) => {
    let message = await userService.createNewUser(req.body);
   
    return res.status(200).json({
        errMessage: message.errMessage,
        errCode: message.errCode,
    })   

}

let handleEditUser = async (req,res) => {
    let data = req.body;
   let message = await userService.updateUser(data);
    return res.status(200).json({
        errMessage: message.errMessage,
        errCode: message.errCode
    })
}

let handleDeleteUser = async (req, res) => {
    if( !req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!',
        })
    } 

    let message = await userService.deleteUser(req.body.id);
   
    return res.status(200).json({
        errMessage: message.errMessage,
        errCode: message.errCode,
    })   
}

let handleRestoreUser = async (req, res) => {
    if( !req.query.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parameters!',
        })
    } 

    let message = await userService.restoreUser(req.query.id);
   
    return res.status(200).json({
        errMessage: message.errMessage,
        errCode: message.errCode,
    })   
}


let getAllCodes = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}


let getTotalUser = async (req, res) => {
    try {
        let data = await userService.getTotalUserService();
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}

let getStatisticWeek = async (req, res) => {
    try {
       
        let data = await userService.getStatisticWeekService(req.query.date, req.query.doctorId, req.query.clinicId);
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}


let getStatisticPresOneDay = async (req, res) => {
    try {
       
        let data = await userService.getStatisticPresOneDayService(req.query.date);
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}
 


let getStatisticPresByDoctor = async (req, res) => {
    try {
       
        let data = await userService.getStatisticPresByDoctorService(req.query.doctorId);
        return res.status(200).json(
            data
        );
    }catch(e){
        console.log('error code server', e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'error server'
        })
    }
}
 



module.exports = {
    handleLogin: handleLogin,
    handleGetAllUser: handleGetAllUser,
    handleCreateNewUser: handleCreateNewUser,
    handleEditUser: handleEditUser,
    handleDeleteUser: handleDeleteUser,
    handleRestoreUser: handleRestoreUser,
    getTotalUser: getTotalUser,
    getAllCodes: getAllCodes,
    getStatisticWeek: getStatisticWeek,
    getStatisticPresOneDay: getStatisticPresOneDay,
    getStatisticPresByDoctor: getStatisticPresByDoctor,
}
