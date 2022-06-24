const nodemailer = require('nodemailer');
const { config, logger } = require("../config");

/* Options to instantiate e-mail transporter */
const options = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.G_USER,
    pass: process.env.G_PASS,
  },
};
const Transporter = nodemailer.createTransport(options);

/* Verify the e-mail service is working and ready for e-mail transport */
const verifyTransport = async () => {
  try {
    await Transporter.verify();
    logger.info('Transporter ready to send email!!');
  } catch (err) {
    logger.error(`Couldn't verify e-mail transporter : ${err.stack}`);
  }
};
verifyTransport();

/* Handle actual e-mail sending */
const send = async ({ from, to, subject, html }) => {
  try {
    const info = await Transporter.sendMail({ from, to, subject, html });
    logger.info(`Email sent to ${to} | response: ${info.response}`);
    return true;
  } catch (err) {
    logger.error(`Error occurred while sending email to ${to}`);
    logger.error(err);
    return false;
  }
};

/* Send the verification e-mail to the user on sign-up */
const sendVerifyEmail = async ({ email, host, id, protocol, username }) => {
  const link = `${protocol}://${host}/api/users/verify-email?vid=${id}`;

  const mailOptions = {
    to: email,
    subject: `Please verify your account at ${config.appName}`,
    html : `
      <h3>Hello ${username},<h3>
      <p>
        Thank you for sigining up to <span style="color:orange; font-size:20px">${config.appName}</span>.
        Your account is almost ready. Please Click on the link below to verify your email.
      </p>
      <p>
        <a
          style="display: inline-block; background-color: #f44336; color: white; padding: 14px 25px; text-align: center; text-decoration: none;"
          target="_blank"
          href="${link}"
        >
          Verify Account
        </a>
      </p>
      <br/>
      <p style="font-size:10px; color:brown">
        This email was sent to ${email} for completing the registration process.
        Please ignore this e-mail if you are not ${username}
      </p>
    `,
  };

  return send(mailOptions);
};

/* Send the e-mail to the user created by the Admin user */
const sendUserCreatedEmail = async ({
  email,
  host,
  password,
  protocol,
  role,
  username,
}) => {
  const link = `${protocol}://${host}/login`;

  const mailOptions = {
    to: email,
    subject: `Your account has been created at ${config.appName}`,
    html: `
      <h3>Hello from ${config.appName}<h3>
      <p>Your account has been created at <span style="color:orange; font-size:20px">${config.appName}</span>.</p>
      <p>Username: ${username}</p>
      <p>Password: ${password}</p>
      <p>Role: ${role.toUppercase()}</p>

      <p>
        We suggest you to change your password after your first login.
        <a
          style="display: inline-block; background-color: #f44336; color: white; padding: 14px 25px; text-align: center; text-decoration: none;"
          target="_blank"
          href="${link}"
        >
          Login to ${config.appName}
        </a>
      </p>
      <p style="font-size:10px; color:brown">
        This email was sent to ${email}. Please ignore this e-mail if you aren't expecting this e-mail.
      </p>
    `
  };

  return send(mailOptions);
};

module.exports = {
  sendVerifyEmail,
  sendUserCreatedEmail,
};
