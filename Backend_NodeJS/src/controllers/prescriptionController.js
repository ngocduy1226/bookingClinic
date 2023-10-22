
import { Association } from "sequelize";
import prescriptionService from "../services/prescriptionService";



let handleCreateNewPrescription = async (req, res) => {
    let pres = await prescriptionService.createNewPrescriptionService(req.body);
   console.log('control', pres)
    return res.status(200).json({
        errMessage: pres.errMessage,
        errCode: pres.errCode,
        data: pres.prescription,

    })   

}





 
module.exports = {
  
    handleCreateNewPrescription: handleCreateNewPrescription,
    

    
}
