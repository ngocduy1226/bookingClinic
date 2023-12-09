import { reject } from "lodash";
import db from "../models/index";
require("dotenv").config();
import nodemailer from "nodemailer";
import moment from 'moment';
import localization from 'moment/locale/vi';


let sendEmailService = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    //  service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,

    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  const info = await transporter.sendMail({
    from: '"Heathy care 👻" <duyduy16102001@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    text: "Hello world?", // plain text body
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
     <h3>Xin chào ${dataSend.patientName}! </h3>
     <p>Bạn nhận được email này thì đã đặt lịch khám bệnh online trên Care heathy thành công </p>
     <p>Thông tin đặt lịch khám bệnh </p>
     <div>Thời gian: ${dataSend.time} </div>
     <div>Bác sĩ: ${dataSend.doctorName} </div>
    <p>Nếu các thông tin trên là đúng, vui lòng click vào link để xác nhận đặt lịch khám bệnh </p>
    <div>
    <a  href=${dataSend.redirectLink} target="_blank">Click </a>
    
    </div>
    <div>Xin chân thành cảm ơn!</div>
     `; // html body
  } else if (dataSend.language === "en") {
    result = `
    <h3>Hello ${dataSend.patientName}! </h3>
    <p>If you have received this email, you have successfully booked an online medical examination appointment on Care healthy</p>
    <p>Information on scheduling medical examinations</p>
    <div>Time: ${dataSend.time} </div>
    <div>Doctor: ${dataSend.doctorName} </div>
   <p>
   If the above information is correct, please click on the link to confirm the medical examination appointment </p>
   <div>
   <a  href=${dataSend.redirectLink} target="_blank">Click </a>
   
   </div>
   <div>Sincerely thank!</div>
    `; // html body
  }
  return result;
};

let sendAttachment = (dataSend) => {
  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        //  service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,

        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      
      const info = await transporter.sendMail({
        from: '"Heathy care 👻" <duyduy16102001@mgail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Kết quả khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmailRemedy(dataSend),
        attachments: {
          filename: `Remedy-${dataSend.patientName}-${new Date().getTime()}.pdf`,
           content: dataSend.imageBase64.split("base64,")[1],
          encoding: 'base64',
        
          
        },
      });

      resolve();
    }
    catch (e) {
      reject(e);
    }
  })
}


let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
     <h3>Xin chào ${dataSend.patientName}! </h3>
     <p>Bạn nhận được email này khi bạn đã khám bệnh ở chỗ chúng tôi thành công </p>
     <p>Thông tin đơn thuốc </p>
    
    <div>Xin chân thành cảm ơn!</div>
     `; // html body
  } else if (dataSend.language === "en") {
    result = `
    <h3>Hello! ${dataSend.patientName} </h3>
    <p>You receive this email when you have successfully had a medical examination with us</p>

    
   <p> Prescription information</p>
  
   <div>Sincerely thank!</div>
    `; // html body
  }
  return result;
}


let sendCancelAttachment = (dataSend) => {

  return new Promise(async (resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        //  service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,

        auth: {
          // TODO: replace `user` and `pass` values from <https://forwardemail.net>
          user: process.env.EMAIL_APP,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });
      


      const info = await transporter.sendMail({
        from: '"Heathy care 👻" <duyduy16102001@mgail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Hủy lịch khám bệnh", // Subject line
        text: "Hello world?", // plain text body
        html: getBodyHTMLEmailCancelRemedy(dataSend),
      });

      resolve();
    }
    catch (e) {
      reject(e);
    }
  })
}


let getBodyHTMLEmailCancelRemedy =  (dataSend) => {
  let date =   moment.unix(+ dataSend.date / 1000).format('dddd - DD/MM/YYYY');


  let result = "";
  if (dataSend.language === "vi") {
    result = `
     <h3>Xin chào ${dataSend.patientName}! </h3>
     <p>Vì một vài lí do nên chúng tôi xin phép hủy lịch hẹn ${date}, ca khám ${dataSend.timeTypePatient.valueVi}. </p>
     
     <p>Mong quý khách vui lòng đăng ký lịch hẹn khác ạ ! </p>
    
    <div>Xin lỗi vì sự bất tiện này!</div>
     `; // html body
  } else if (dataSend.language === "en") {
    result = `
    <h3>Hello! ${dataSend.patientName} </h3>
    <p>Because our doctor is busy, we would like to cancel this appointment on ${date}, the ${dataSend.timeTypePatient.valueEn} examination.
    
    <p>Please register for another appointment !</p>
  
   <div>Sorry for the inconvenience!</div>
    `; // html body
  }
  return result;
}

module.exports = {
  sendEmailService: sendEmailService,
  sendAttachment: sendAttachment,
  sendCancelAttachment: sendCancelAttachment,
};
