import nodemailer from "nodemailer";
import { CustomError } from "../utils/index.js";
const { SMTP_HOST, SMTP_USER, SMTP_PASSWORD } = process.env;

const transporter = nodemailer.createTransport({
  host: SMTP_HOST || "smtp.gmail.com", // Replace with your SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER, // Your email
    pass: SMTP_PASSWORD, // Your email password
  },
});

const returnHtml = (htmlMsg) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body{
          background-color: #fff !important;
          font-family: Montserrat;
        }
        .main {
          width: 100%;
          height: auto;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #fff;
          font-family: sans-serif;
          color: #000;
        }
        .container {
          padding: 0 30px;
        }
  
        .button {
          padding: 15px 25px;
          background-color: #fa621c;
          border: 1px solid #fa621c;
          border-radius: 15px;
          color: #fff;
          letter-spacing: 2px;
          font-size: 18px;
          font-weight: bold;
          width: fit-content;
        }
        a:link {
          color: #fff;
          text-decoration: none;
        }
        a:hover {
          text-decoration: none;
        }
        h1 {
          text-align: center;
        }
        .firstParagraph {
          margin-top: 40px;
          margin-bottom: 30px;
          font-size: 20px;
        }
        .secondParagraph {
          margin-top: 10px;
          font-size: 15px;
        }
        .logo {
          text-align: center;
          margin-bottom: 50px;
          background-color : #ee3137;
          color : #fff;
          font-weight: 800;
          font-size: 1.875rem;
          line-height: 2.25rem;
        }
      </style>
    </head>
    <body>
      <div class="main">
        <div class="container">
          <div class="logo">
            <h2>Brillica Services Pvt. Ltd.</h2>
          </div>
          ${htmlMsg}
        </div>
      </div>
    </body>
  </html>
  `;
};

// ============================== Send User Login Credentials ========================
export const sendLoginCredentials = async (toMail, name, password) => {
  const htmlMsg = `<h1>Login Credentials</h1>
          <p class="firstParagraph">
            Hello ${name},
          </p>
          <p>Your account has been created successfully.</p>
          <p>Your password is : <b>${password}</b></p>
          <br />
          <p class="secondParagraph">Thank you</p>
          <p class="secondParagraph">Brillica Services Pvt. ltd.</p>`;

  const mailOptions = {
    to: toMail,
    from: { name: "Brillica Services pvt. ltd.", address: SMTP_USER },
    subject: "Welcome to ERP",
    html: returnHtml(htmlMsg),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toMail}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new CustomError("Email could not be sent", 500);
  }
};

// ============================== Send OTP on Password Reset ========================
export const sendOTP = async (toMail, name, otp) => {
  const htmlMsg = `<h1>Reset Password</h1>
          <p class="firstParagraph">
            Hello ${name},
          </p>
          <p>You have requested for Password Reset.</p>
          <p>Your OTP is : <b>${otp}</b></p>
          <br />
          <p class="secondParagraph">Thank you</p>
          <p class="secondParagraph">Brillica Services Pvt. ltd.</p>`;

  const mailOptions = {
    to: toMail,
    from: { name: "Brillica Services pvt. ltd.", address: SMTP_USER },
    subject: "Reset Password",
    html: returnHtml(htmlMsg),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toMail}`);
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    throw new CustomError("Email could not be sent", 500);
  }
};
