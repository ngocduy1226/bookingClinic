
import { Association } from "sequelize";
import commentService from "../services/commentService";




let handleGetAllComment = async (req, res) => {
 
    // id => user(id)
    // all => users
    let data = await commentService.handleGetAllCommentService(req.query.doctorId, req.query.currentDate);

    return res.status(200).json({
        data,
    })   

    
}


let handleGetAllCommentByDoctorId = async (req, res) => {

     let data = await commentService.handleGetAllCommentByDoctorIdService(req.query.doctorId, req.query.status );

    return res.status(200).json({
        data,
    })   

    
}

let handleCreateNewComment = async (req, res) => {
    let data = await commentService.handleCreateNewCommentService(req.body);

    return res.status(200).json({
        errMessage: data.errMessage,
        errCode: data.errCode,
    })

}


let handShowHideComment = async (req, res) => {
    try {
        let data = await commentService.handShowHideCommentService(req.query.commentId, req.query.status ,req.query.date);
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
    handShowHideComment: handShowHideComment,
    handleCreateNewComment: handleCreateNewComment,
handleGetAllComment: handleGetAllComment,
handleGetAllCommentByDoctorId: handleGetAllCommentByDoctorId,
   
   


}
