// const nodemailer = require('nodemailer');

// const sendEmail = async (email, subject, text) => {
//   try {
//     console.log('Sending email to:', email); // Debug log

//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject,
//       text,
//     });

//     console.log('Email sent successfully to:', email); // Debug log
//   } catch (error) {
//     console.error('Error sending email:', error); // Debug log
//     throw error;
//   }
// };

// module.exports = sendEmail;
const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    console.log('Sending email to:', email); // Debug log

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', email); // Debug log
  } catch (error) {
    console.error('Error sending email:', error); // Debug log
    throw error;
  }
};

module.exports = sendEmail;