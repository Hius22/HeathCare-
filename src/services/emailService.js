require('dotenv').config();
import nodemailer from "nodemailer";

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let info = await transporter.sendMail({
        from: '"CareDirect" <nguyenhuuhieu02022004@gmail.com>',
        to: dataSend.receiverEmail,
        subject: dataSend.language === 'vi' 
            ? "Xác nhận đặt lịch hẹn khám bệnh - CareDirect" 
            : "Confirm Medical Appointment Booking - CareDirect",
        html: getBodyHTMLEmail(dataSend),
    });
}

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result =
            `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Nền tảng y tế chăm sóc sức khỏe toàn diện</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Xin chào ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Bạn nhận được email này vì đã thực hiện đặt lịch khám bệnh trực tuyến trên hệ thống <b>CareDirect</b>.</p>
                    
                    <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: #2d3748; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Thông tin đặt lịch khám bệnh:</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #718096; width: 100px; font-size: 14px;">Bác sĩ:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Thời gian:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.time}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">Nếu các thông tin đặt lịch trên là chính xác, vui lòng click vào nút bên dưới để xác nhận và hoàn tất việc đăng ký khám bệnh:</p>
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <a href="${dataSend.redirectLink}" target="_blank" style="background-color: #1a73e8; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2); font-size: 15px;">
                            Xác nhận lịch khám
                        </a>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">Hệ thống chăm sóc sức khỏe CareDirect</p>
                </div>
            </div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Comprehensive Healthcare Platform</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Dear ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">You have received this email because you booked an online medical appointment on the <b>CareDirect</b> platform.</p>
                    
                    <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: #2d3748; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Appointment Details:</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #718096; width: 100px; font-size: 14px;">Doctor:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Time:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.time}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">If the above information is correct, please click the button below to confirm and complete your booking:</p>
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <a href="${dataSend.redirectLink}" target="_blank" style="background-color: #1a73e8; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2); font-size: 15px;">
                            Confirm Appointment
                        </a>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Thank you for choosing our service!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">CareDirect Healthcare System</p>
                </div>
            </div>
        `
    }

    return result;
}

let sendAttachment = async (dataSend) => {
    return new Promise(async (resolve, reject) => {
        try {
            let transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_APP,
                    pass: process.env.EMAIL_APP_PASSWORD,
                },
            });

            let mailOptions = {
                from: '"CareDirect" <nguyenhuuhieu02022004@gmail.com>',
                to: dataSend.email,
                subject: dataSend.language === 'vi' 
                    ? "Kết quả khám bệnh & Đơn thuốc - CareDirect" 
                    : "Medical Examination Results & Prescription - CareDirect",
                html: getBodyHTMLEmailRemedy(dataSend),
            };

            if (dataSend.imgBase64) {
                let fileExtension = 'png';
                let base64Data = dataSend.imgBase64;
                
                if (dataSend.imgBase64.includes(';base64,')) {
                    let parts = dataSend.imgBase64.split(';base64,');
                    base64Data = parts[1];
                    let mimeType = parts[0].split(':')[1];
                    if (mimeType) {
                        fileExtension = mimeType.split('/')[1] || 'png';
                    }
                } else if (dataSend.imgBase64.includes('base64,')) {
                    let parts = dataSend.imgBase64.split('base64,');
                    base64Data = parts[1];
                }

                mailOptions.attachments = [
                    {
                        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.${fileExtension}`,
                        content: base64Data,
                        encoding: 'base64'
                    }
                ];
            }

            await transporter.sendMail(mailOptions);
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
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Kết Quả Khám Bệnh & Đơn Thuốc</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Xin chào ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Bạn nhận được email này vì đã hoàn tất buổi khám bệnh trên hệ thống <b>CareDirect</b>.</p>
                    
                    <div style="background-color: #f8f9fa; border: 1px solid #edf2f7; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 14px 0; color: #1a73e8; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Thông tin bệnh án chi tiết:</h4>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: #718096; font-size: 13px; display: block;">Chẩn đoán bệnh:</span>
                            <span style="color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.diagnosis || 'Không có'}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: #718096; font-size: 13px; display: block;">Chỉ định cận lâm sàng / dịch vụ:</span>
                            <span style="color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.services || 'Không có'}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: #718096; font-size: 13px; display: block;">Phương thức thanh toán:</span>
                            <span style="color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.paymentMethod || 'Chưa xác định'}</span>
                        </div>
                        
                        <div style="margin-bottom: 6px;">
                            <span style="color: #718096; font-size: 13px; display: block; margin-bottom: 6px;">Đơn thuốc & Dặn dò của bác sĩ:</span>
                            <div style="white-space: pre-line; background-color: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-radius: 6px; color: #2d3748; font-size: 14px; line-height: 1.5; font-family: Courier, monospace;">
                                ${dataSend.prescription || 'Không có'}
                            </div>
                        </div>
                    </div>
                    
                    ${dataSend.imgBase64 ? '<p style="color: #4a5568; font-size: 13px; margin-bottom: 20px;"><i style="color: #1a73e8;">* File đính kèm (hóa đơn hoặc đơn thuốc có chữ ký) đã được tải kèm trong email này.</i></p>' : ''}
                    
                    ${dataSend.followUpDate ? `
                    <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 14px; margin-bottom: 24px; color: #c53030;">
                        <p style="margin: 0; font-size: 14px;">
                            <b>Lịch hẹn tái khám:</b> <span style="font-weight: bold;">${dataSend.followUpDate}</span>. 
                            Vui lòng truy cập lại hệ thống CareDirect để đặt lịch mới trước ngày hẹn.
                        </p>
                    </div>` : ''}
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">Nếu bạn có bất kỳ thắc mắc nào khác về kết quả và đơn thuốc này, vui lòng liên hệ bộ phận hỗ trợ chăm sóc khách hàng của chúng tôi.</p>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Chúc bạn nhiều sức khỏe và mau chóng bình phục!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">Hệ thống y tế CareDirect</p>
                </div>
            </div>
        `
    }
    if (dataSend.language === 'en') {
        result =
            `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Medical Examination & Prescription</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Hello ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">You are receiving this email because you completed your medical examination on the <b>CareDirect</b> system.</p>
                    
                    <div style="background-color: #f8f9fa; border: 1px solid #edf2f7; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 20px;">
                        <h4 style="margin: 0 0 14px 0; color: #1a73e8; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Detailed Medical Record:</h4>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: #718096; font-size: 13px; display: block;">Diagnosis:</span>
                            <span style="color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.diagnosis || 'None'}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: #718096; font-size: 13px; display: block;">Clinical Services / Lab Work:</span>
                            <span style="color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.services || 'None'}</span>
                        </div>
                        
                        <div style="margin-bottom: 12px;">
                            <span style="color: #718096; font-size: 13px; display: block;">Payment Method:</span>
                            <span style="color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.paymentMethod || 'Not specified'}</span>
                        </div>
                        
                        <div style="margin-bottom: 6px;">
                            <span style="color: #718096; font-size: 13px; display: block; margin-bottom: 6px;">Prescription & Doctor's Instructions:</span>
                            <div style="white-space: pre-line; background-color: #ffffff; padding: 14px; border: 1px solid #e2e8f0; border-radius: 6px; color: #2d3748; font-size: 14px; line-height: 1.5; font-family: Courier, monospace;">
                                ${dataSend.prescription || 'None'}
                            </div>
                        </div>
                    </div>
                    
                    ${dataSend.imgBase64 ? '<p style="color: #4a5568; font-size: 13px; margin-bottom: 20px;"><i style="color: #1a73e8;">* The attachment file (prescription or medical bill scan) is attached to this email.</i></p>' : ''}
                    
                    ${dataSend.followUpDate ? `
                    <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-radius: 8px; padding: 14px; margin-bottom: 24px; color: #c53030;">
                        <p style="margin: 0; font-size: 14px;">
                            <b>Follow-up Appointment:</b> <span style="font-weight: bold;">${dataSend.followUpDate}</span>. 
                            Please visit the CareDirect system to book your follow-up appointment before this date.
                        </p>
                    </div>` : ''}
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">If you have any questions regarding this medical record, please feel free to reach out to our support team.</p>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Wishing you a speedy recovery and good health!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">CareDirect Healthcare System</p>
                </div>
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
                from: '"CareDirect" <nguyenhuuhieu02022004@gmail.com>',
                to: dataSend.email,
                subject: dataSend.language === 'vi'
                    ? 'Thông báo hủy lịch hẹn khám bệnh - CareDirect'
                    : 'Medical Appointment Cancellation Notice - CareDirect',
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
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #e53e3e; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Thông Báo Hủy Lịch Hẹn Khám</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Xin chào ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Chúng tôi xin thông báo rằng lịch hẹn đặt khám bệnh của bạn trên hệ thống <b>CareDirect</b> đã được <b>hủy bỏ</b> thành công.</p>
                    
                    <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-left: 4px solid #e53e3e; border-radius: 8px; padding: 18px; margin-bottom: 24px; color: #2d3748;">
                        <p style="margin: 0; font-size: 14px; font-weight: bold; color: #c53030;">Trạng thái lịch hẹn: ĐÃ HỦY (CANCELLED)</p>
                        <p style="margin: 8px 0 0 0; font-size: 13px; color: #4a5568;">Lịch hẹn khám này đã được xóa khỏi hệ thống làm việc của bác sĩ. Mọi thông tin xác nhận trước đó đều không còn hiệu lực.</p>
                    </div>
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">Nếu bạn có nhu cầu đặt lại lịch khám mới hoặc lựa chọn bác sĩ và thời gian khám phù hợp khác, vui lòng truy cập website CareDirect bằng cách nhấn nút dưới đây:</p>
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <a href="${process.env.URL_REACT || 'http://localhost:3000'}/booking-flow" target="_blank" style="background-color: #1a73e8; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2); font-size: 14px;">
                            Đặt lịch khám mới
                        </a>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Xin chân thành cảm ơn sự hợp tác của bạn!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">Hệ thống chăm sóc sức khỏe CareDirect</p>
                </div>
            </div>
        `;
    }

    if (dataSend.language === 'en') {
        result = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #e53e3e; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Appointment Cancellation Notice</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Hello ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">We would like to inform you that your medical appointment on the <b>CareDirect</b> system has been successfully <b>cancelled</b>.</p>
                    
                    <div style="background-color: #fff5f5; border: 1px solid #fed7d7; border-left: 4px solid #e53e3e; border-radius: 8px; padding: 18px; margin-bottom: 24px; color: #2d3748;">
                        <p style="margin: 0; font-size: 14px; font-weight: bold; color: #c53030;">Appointment Status: CANCELLED</p>
                        <p style="margin: 8px 0 0 0; font-size: 13px; color: #4a5568;">This appointment has been removed from the doctor's active schedule. Any previous confirmation is no longer valid.</p>
                    </div>
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">If you wish to reschedule a new appointment or choose another doctor/time, please visit the CareDirect website by clicking the button below:</p>
                    
                    <div style="text-align: center; margin-bottom: 28px;">
                        <a href="${process.env.URL_REACT || 'http://localhost:3000'}/booking-flow" target="_blank" style="background-color: #1a73e8; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: bold; border-radius: 8px; display: inline-block; box-shadow: 0 4px 10px rgba(26, 115, 232, 0.2); font-size: 14px;">
                            Book New Appointment
                        </a>
                    </div>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Thank you for your cooperation!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">CareDirect Healthcare System</p>
                </div>
            </div>
        `;
    }

    return result;
};


let sendUpdateInfoEmail = async (dataSend) => {
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
                from: '"CareDirect" <nguyenhuuhieu02022004@gmail.com>',
                to: dataSend.receiverEmail,
                subject: dataSend.language === 'vi'
                    ? 'Xác nhận cập nhật thông tin cá nhân - CareDirect'
                    : 'Personal Information Update Confirmation - CareDirect',
                html: getBodyHTMLUpdateInfo(dataSend),
            });

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

let getBodyHTMLUpdateInfo = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Cập nhật thông tin cá nhân</p>
                </div>

                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Xin chào ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Thông tin cá nhân của bạn trên hệ thống <b>CareDirect</b> đã được <b style="color: #1a73e8;">cập nhật thành công</b>. Dưới đây là thông tin mới nhất đã được ghi nhận:</p>

                    <div style="background-color: #f0f7ff; border: 1px solid #bee3f8; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: #2b6cb0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Thông tin đã cập nhật:</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #718096; width: 120px; font-size: 14px;">Họ và tên:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.fullName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Số điện thoại:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Địa chỉ:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Giới tính:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.gender}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #92400e;">
                            <b>⚠ Lưu ý:</b> Nếu bạn không thực hiện thay đổi này, vui lòng liên hệ ngay với bộ phận hỗ trợ của chúng tôi để được xử lý kịp thời.
                        </p>
                    </div>

                    <p style="color: #4a5568; margin-bottom: 16px;">Thông tin mới này sẽ được áp dụng cho tất cả các lịch hẹn hiện tại của bạn. Bác sĩ của bạn sẽ sử dụng các thông tin này trong quá trình khám bệnh.</p>
                </div>

                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">Hệ thống chăm sóc sức khỏe CareDirect</p>
                </div>
            </div>
        `;
    }
    if (dataSend.language === 'en') {
        result = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Personal Information Update</p>
                </div>

                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Hello ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Your personal information on the <b>CareDirect</b> system has been <b style="color: #1a73e8;">successfully updated</b>. Below are your latest recorded details:</p>

                    <div style="background-color: #f0f7ff; border: 1px solid #bee3f8; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: #2b6cb0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Updated Information:</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #718096; width: 120px; font-size: 14px;">Full Name:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.fullName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Phone:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.phoneNumber}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Address:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.address}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Gender:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.gender}</td>
                            </tr>
                        </table>
                    </div>

                    <div style="background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 8px; padding: 14px; margin-bottom: 24px;">
                        <p style="margin: 0; font-size: 13px; color: #92400e;">
                            <b>⚠ Notice:</b> If you did not make this change, please contact our support team immediately.
                        </p>
                    </div>

                    <p style="color: #4a5568; margin-bottom: 16px;">This updated information will be applied to all your current appointments. Your doctor will use these details during your consultation.</p>
                </div>

                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Thank you for choosing our service!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">CareDirect Healthcare System</p>
                </div>
            </div>
        `;
    }
    return result;
};

let sendRescheduleEmail = async (dataSend) => {
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
                from: '"CareDirect" <nguyenhuuhieu02022004@gmail.com>',
                to: dataSend.email,
                subject: dataSend.language === 'vi'
                    ? 'Xác nhận thay đổi lịch hẹn khám bệnh - CareDirect'
                    : 'Medical Appointment Reschedule Confirmation - CareDirect',
                html: getBodyHTMLEmailReschedule(dataSend),
            });

            resolve();
        } catch (e) {
            reject(e);
        }
    });
};

let getBodyHTMLEmailReschedule = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Xác Nhận Thay Đổi Lịch Khám</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Xin chào ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Lịch hẹn đặt khám bệnh của bạn trên hệ thống <b>CareDirect</b> đã được <b>thay đổi thành công</b>.</p>
                    
                    <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: #2d3748; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Thông tin lịch khám mới:</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #718096; width: 100px; font-size: 14px;">Bác sĩ:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">Thời gian mới:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.time}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">Vui lòng có mặt trước giờ khám 10-15 phút tại quầy lễ tân để tiến hành tiếp đón khám bệnh.</p>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">Hệ thống chăm sóc sức khỏe CareDirect</p>
                </div>
            </div>
        `;
    } else {
        result = `
            <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; color: #2d3748; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
                <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px solid #edf2f7; margin-bottom: 24px;">
                    <h1 style="color: #1a73e8; font-size: 26px; margin: 0; font-weight: 700; letter-spacing: -0.5px;">CareDirect</h1>
                    <p style="font-size: 13px; color: #718096; margin: 4px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Appointment Rescheduled Confirmation</p>
                </div>
                
                <div style="font-size: 15px; line-height: 1.6;">
                    <h3 style="color: #2d3748; margin-top: 0; font-size: 18px; font-weight: 600;">Dear ${dataSend.patientName},</h3>
                    <p style="color: #4a5568; margin-bottom: 20px;">Your medical appointment on the <b>CareDirect</b> system has been <b>successfully rescheduled</b>.</p>
                    
                    <div style="background-color: #f7fafc; border: 1px solid #edf2f7; border-left: 4px solid #1a73e8; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
                        <h4 style="margin: 0 0 12px 0; color: #2d3748; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">New Appointment Details:</h4>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 6px 0; color: #718096; width: 100px; font-size: 14px;">Doctor:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.doctorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #718096; font-size: 14px;">New Time:</td>
                                <td style="padding: 6px 0; color: #2d3748; font-weight: bold; font-size: 15px;">${dataSend.time}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p style="color: #4a5568; margin-bottom: 24px;">Please arrive 10-15 minutes prior to your new scheduled time at the reception desk for check-in.</p>
                </div>
                
                <div style="border-top: 1px solid #edf2f7; padding-top: 20px; font-size: 12px; color: #a0aec0; text-align: center; line-height: 1.5;">
                    <p style="margin: 0 0 4px 0;">Thank you for your trust in our service!</p>
                    <p style="margin: 0; font-weight: bold; color: #718096;">CareDirect Healthcare System</p>
                </div>
            </div>
        `;
    }
    return result;
};

module.exports = {
    sendSimpleEmail: sendSimpleEmail,
    sendAttachment: sendAttachment,
    sendCancelEmail: sendCancelEmail,
    sendUpdateInfoEmail: sendUpdateInfoEmail,
    sendRescheduleEmail: sendRescheduleEmail
}