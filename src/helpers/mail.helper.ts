import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import logger from './logger/logger';
import { mailData } from './commonUtils';
// Create a transporter using your email service's SMTP settings
const transporter: Transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// Function to send forgot password email
export const sendMail = async (userInfo: { email: string, name: string, token: string, type: string }): Promise<void> => {
    try {
        const mailOptions: SendMailOptions = {
            from: process.env.SMTP_USER,
            to: userInfo.email,
            subject: mailData(userInfo).subject,
            html: mailData(userInfo).body,
        };
        await transporter.sendMail(mailOptions);

        let mailLog = userInfo.type == "resetPassword" ? 'Forgot password email sent successfully' : userInfo.type == "verifyEmail" ? "Email verification mail sent successfully" : "Mail sent";
        logger.info(mailLog);
    } catch (error) {
        console.log(error.message)
        logger.error('Error sending forgot password email:', error);
    }
}