

const nodemailer = require('nodemailer')
const dotenv = require("dotenv")
dotenv.config() 
// initialize nodemailer
var transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    }
);


// trigger the sending of the E-mail
const sendMail = (user) =>{
    
    const verificationToken = user.generateVerificationToken();
    // Step 3 - Email the user a unique verification link
    const url = `http://localhost:3000/api/verify/${verificationToken}`
    console.log("verificationToken=",verificationToken)
    console.log("url is",url,user.email);
     transporter.sendMail({
        to: user.email, // list of receivers
        subject: 'Verify Account',
        html: `Click <a href = '${url}'>here</a> to confirm your email.`,
        template: 'email', // the name of the template file i.e email.handlebars
    }, function(error, info){
         if(error){
             return console.log(error);
         }
         console.log('Message sent: ' + info.response);
    });
    
} 

module.exports = { sendMail }