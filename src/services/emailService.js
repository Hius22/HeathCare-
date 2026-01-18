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

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {


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
                from: '"Hiếu Nguyễn" <nguyenhuuhieu02022004@gmail.com>',
                to: dataSend.email,
                subject: "Kết quả khám bệnh",
                html: getBodyHTMLEmailRemedy(dataSend),
                attachments: [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                        content: dataSend.imgBase64.split("base64,")[1],
                        encoding: 'base64'
                    }
                ],
            });

            resolve();
        } catch (e) {
            reject(e);
        }
    })
}

let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
            <h3>Xin chào ${dataSend.patientName}!</h3>
            <p>Bạn nhận được email này vì đã hoàn tất buổi khám bệnh bên BookingCare</p>
            <p>Thông tin chi tiết về <b>đơn thuốc</b> và <b>hóa đơn</b> đã được đính kèm file
            trong email này.  </p>

            <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ lại với chúng tôi 
            để được hỗ trợ kịp thời.</p>
            <div style="margin-top: 20px;">
            <b>Xin chân thành cảm ơn!</b>
            </div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
            <h3>Hello ${dataSend.patientName}!</h3>
            <p>
            You are receiving this email because you have completed your medical
            appointment with BookingCare.
            </p>
            <p>
            Detailed information regarding your <b>prescription</b> and <b>invoice</b>
            has been attached to this email as files.
            </p>
            <p>
            If you have any questions or need further assistance, please feel free
            to contact us. We are always happy to help.
            </p>
            <div style="margin-top: 20px;">
            <b>Thank you very much!</b>
            </div>
        `
    }

    return result;
}

let sendCancelEmail = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            await transporter.sendMail({
                from: '"BookingCare" <nguyenhuuhieu02022004@gmail.com>',
                to: dataSend.email,
                subject: dataSend.language === 'vi'
                    ? 'Thông báo hủy lịch khám bệnh'
                    : 'Appointment Cancellation Notice',
                html: getBodyHTMLEmailCancel(dataSend),
            });

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

let getBodyHTMLEmailCancel = (dataSend) => {
    let result = '';

    if (dataSend.language === 'vi') {
        result = `
            <h3>Xin chào ${dataSend.patientName}!</h3>

            <p>
                Chúng tôi xin thông báo rằng lịch khám bệnh của bạn tại 
                <b>BookingCare</b> đã được <b>hủy</b>.
            </p>

            <p>
                Nếu bạn có nhu cầu đặt lại lịch khám, vui lòng truy cập hệ thống
                BookingCare để lựa chọn thời gian phù hợp.
            </p>

            <div style="margin-top: 20px;">
                <b>Xin chân thành cảm ơn!</b>
            </div>
        `;
    }

    if (dataSend.language === 'en') {
        result = `
            <h3>Hello ${dataSend.patientName}!</h3>

            <p>
                We would like to inform you that your medical appointment with
                <b>BookingCare</b> has been <b>cancelled</b>.
            </p>

            <p>
                If you wish to reschedule your appointment, please visit
                BookingCare to select a new time.
            </p>

            <div style="margin-top: 20px;">
                <b>Thank you very much!</b>
            </div>
        `;
    }

    return result;
};


module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendCancelEmail: sendCancelEmail
}