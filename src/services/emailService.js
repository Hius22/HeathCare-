require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    // Create a test account or replace with real credentials.
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // Wrap in an async IIFE so we can use await.
    let info = await transporter.sendMail({
        from: '"HIUS" <nguyenhuuhieu02022004@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "Thông tin đặt lịch khám bệnh",
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online bên BookingCare</p>
            <p>Thông tin đặt lịch khám bệnh: </p>
            <div><b>Thời gian: ${dataSend.time}</b></div>
            <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>

            <p>Nếu các thông tin trên là đúng, vui lòng click vào đường dẫn này để xác nhận đặt lịch khám bệnh</p>
            <div>
                <a href="${dataSend.redirectLink}" target="_blank">Link</a>
            </div>

            <div>Xin chân thành cảm ơn!</div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
            <h3>Dear ${dataSend.patientName}!</h3>
            <p>You have received this email because you have booked an online medical appointment with BookingCare.</p>
            <p>Appointment information: </p>
            <div><b>Time: ${dataSend.time}</b></div>
            <div><b>Doctor: ${dataSend.doctorName}</b></div>

            <p>If the above information is correct, please click on this link to confirm your appointment.</p>
            <div>
                <a href="${dataSend.redirectLink}" target="_blank">Link</a>
            </div>

            <div>Thank you very much!</div>
        `
    }

    return result;

}




module.exports = {
    sendSimpleEmail: sendSimpleEmail,

}