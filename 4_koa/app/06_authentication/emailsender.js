const nodemailer = require("nodemailer");
const {htmlToText} = require('nodemailer-html-to-text');

const config = require("config");

const juice = require("juice");

const nodeMailerConfig = config.get('nodemailer').gmail;
const cssPath = config.get('static') + '/email.css';

const transporter = nodemailer.createTransport(nodeMailerConfig);
transporter.use('compile', htmlToText());

const sendMail = async ({message, htmlFile}) => {
  const mailOptions = {
    from: 'iroskoshnyi@softjourn.com', // sender address
    to: "ivanroskishny@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: message, // plain text body
    html: juice.inlineContent(htmlFile, cssPath)// html body
  };
  const info = await transporter.sendMail(mailOptions);

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}
module.exports.sendMail = sendMail;
module.exports.get = async ctx => {
  ctx.body = ctx.render('email');
};
module.exports.post = async ctx => {
  const {message} = ctx.request.body;
  const htmlFile = ctx.render('email');
  await sendMail({
    ctx,
    message,
    htmlFile
  })
  ctx.redirect('/email');
};
