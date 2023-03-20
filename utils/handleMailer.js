const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({//recibe un objeto
host: "smtp.mailtrap.io", //herramienta utilizada para hacer testeo de envio de emails
port: 2525,
auth:{
    user:process.env.mail_user,
    pass: process.env.mail_pass,
}
});

module.exports= transporter; 