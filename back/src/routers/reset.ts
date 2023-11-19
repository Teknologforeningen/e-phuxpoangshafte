import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import User from '../db/models/models/users.model';

const mailTransporter: Transporter = (() => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PW,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  } as SMTPTransport.Options);
})();

const resetRouter = require('express').Router();

resetRouter.post('/', async (req, res) => {
  const email = req.body.email.toLowerCase();

  if (!email) {
    return res.status(401).json({
      error: 'Email not provided',
    });
  }

  const saltRounds = 10;
  const password = crypto.randomBytes(16).toString('base64url');
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = await User.findOne({ where: { email } });

  // Fail silently if no user was found to discourage probing for login emails
  if (!user) {
    res.status(200).send();
    return;
  }

  user.update({ password: passwordHash });

  const msg = {
    to: email,
    from: process.env.MAIL_FROM,
    subject: 'Återställ lösenord',
    text: `Ert lösenord till e-phuxpoängskortet har återställts.
Ert nya lösenord är ${password}
Lösenordet kan bytas efter inloggning på poäng.tf.fi`,
  };

  mailTransporter.sendMail(msg);

  res.status(200).send();
});

export default resetRouter;
