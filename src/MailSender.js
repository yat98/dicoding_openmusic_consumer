import 'dotenv/config';
import nodemailer from 'nodemailer';
import mail from './config/mail.js';

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: mail.host,
      port: mail.port,
      auth: {
        user: mail.user,
        pass: mail.password,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'Openmusic App',
      to: targetEmail,
      subject: 'Export Playlist',
      text: 'Result from export playlist',
      attachments: [
        {
          filename: 'playlist.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

export default MailSender;
