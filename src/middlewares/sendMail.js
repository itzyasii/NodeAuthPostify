const nodemail = require('nodemailer');

const tranport = nodemailer.transport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports = tranport;