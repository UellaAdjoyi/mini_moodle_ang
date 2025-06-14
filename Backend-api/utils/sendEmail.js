const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    // Crée un transporteur SMTP
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'uellaadjoyi07@gmail.com',
            pass: 'opigtxijimdswckn',
        },
    });

    // Options du mail
    let mailOptions = {
        from: 'minimoodleTeam@gmail.com',
        to,
        subject,
        text,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;