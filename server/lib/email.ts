const nodemailer = require("nodemailer");

export function isEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function sendEmail(to: string, subject: string, content: string) {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER!,
            pass: process.env.EMAIL_PASSWORD!
        }
    });

    const mailOptions = {
        from: '"MarkADay" <playvalguesser@gmail.com>',
        to,
        subject,
        html: content
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err) {
        console.error("Error sending email:", err);
    }
}

export function emailToUsername(email: string) {
    const username = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
    return username;
}