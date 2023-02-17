const nodemailer = require('nodemailer');
const db = require('../database/db');


const transporter = nodemailer.createTransport({
    service: 'outlook',
    auth: {
      user: 'sojacons@outlook.es',
      pass: 'Mamisconshorts21'
    }
});

module.exports.nodemailerthing = async function (req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const motivo = req.body.motivo;


    const mailOptions = {
        from: 'sojafriaocaliente@outlook.es',
        to: email,
        subject: 'Formulario de contacto de SOJA',
        text: `Name: ${name} Email: ${email} Motivo: ${motivo} Message: ${message}`
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          res.status(500).send({ message: 'Error al enviar el correo electrónico' });
        } else {
          guardarEnSql(email, motivo);
          console.log('Email enviado: ' + info.response);
          res.status(200).send({ message: 'Correo electrónico enviado con éxito' });
        }
      });
};

function guardarEnSql(email, motivo) {
  let data = {email: email, motivo: motivo};
  const sql = 'INSERT INTO correo SET ?';
  db.query(sql, data, (err, results) => {
    if(err) throw err;
  });
};

