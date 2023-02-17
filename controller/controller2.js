const db = require('../database/db')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {eeemail} = require('./controller');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'sojacons@outlook.es',
    pass: 'Mamisconshorts21'
  }
});


module.exports.crearRegistro = function (req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let sql = "SELECT email FROM register1 WHERE email = ?";
  
    let query = db.query(sql, email, (err, results) => {
        if(err) throw err;
        if(results.length > 0){
            res.send(JSON.stringify({"status": 400, "error": "El email ya esta en uso", "response": null}));
        }else{
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err) throw err;
                    password = hash;
                    let data = {name: name, email: email, password: password};
                    sql = "INSERT INTO register1 SET ?";
                    query = db.query(sql, data, (err, results) => {
                        if(err) throw err;
                        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
                    });
                });
            });
        }
    });
}


module.exports.loginWT = async function (req, res) {
  const secretKey = 'je8ndeo2ne2ije2';
  const email = req.body.email;
  const password = req.body.password;
  let sql = `SELECT * FROM register1 WHERE email = '${email}'`;
  let query = db.query(sql, (err, results) => {
    if (err) throw err;
    console.log(results.length);
    if (results.length > 0) {
      bcrypt.compare(password, results[0].password, (err, isMatch) => {
        if (err) {
          console.log(err);
          res.send(JSON.stringify({ "status": 500, "error": "Internal Server Error", "response": null }));
        } else if (isMatch) {
          console.log(isMatch);
          const payload = { email };
          const options = { expiresIn: '1200 seconds' };
          const token = jwt.sign(payload, secretKey, options);
          res.send(JSON.stringify({ "status": 200, "error": null, "response": results, "token": token }));
        } else {
          console.log(isMatch);
          res.send(JSON.stringify({ "status": 400, "error": "Invalid email or password", "response": null }));
        }
      });
    } else {
      res.send(JSON.stringify({ "status": 400, "error": "Invalid email or password", "response": null }));
    }
  });
};



module.exports.tokenRecuperacionPasswd = async function (req, res) {
  const email = req.body.email;
  const secretKey = 'je8ndeo2ne2ije2';
  const payload = { email };
  const options = { expiresIn: '600 seconds' };
  const token = jwt.sign(payload, secretKey, options);
  res.json({ token });
}



module.exports.tokenAcceso= async function (req, res) {
    res.json({ message: 'Accesopermitido' });
}

module.exports.nodemailerNewPassword = async function (req, res) {
  let token = req.body.token;
  let email = req.body.email;
    let mailOptions = {
        from: 'sojacons@outlook.es',
        to: email,
        subject: 'Recuperación de contraseña',
        text: 'Haga clic en este enlace para restablecer su contraseña: http://127.0.0.1:5500/.src/CLIENTE/RecuperPasswd/index.html?tk=' + token
    };
    let sql = `SELECT email FROM register1 WHERE email = "${email}"`;
    console.log("🚀 ~ file: controller2.js:103 ~ db.query ~ sql", sql)
      db.query(sql, email,(err, results) => {
      if(err)throw err;
      if(results.length > 0){
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
                return res.status(500).json({ message: 'Error al enviar el correo electrónico' });
            }
            res.status(200).json({ message: 'Correo electrónico enviado' });
            checkIfEmailExsist(email)
            console.log(email);
        });
      } else {
        return res.status(200).json({ message: 'El correo electronico proporcionado no coincide con ningun usuario' });
      }  
      });
};


module.exports.updateBBDDNewPassword = async function (req, res) {
  const newPassword = req.body.newPassword;
  const eeemail = req.body.email;
  const sql = `SELECT * FROM register1 WHERE email = "${eeemail}"`

    db.query(sql, eeemail,
      async (error, results) => {
        console.log(results);
        if (error) {
          return res.status(500).json({ message: error.message });
        }
        if (results.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }
        const hash = await bcrypt.hash(newPassword, 10);
        db.query(
          `UPDATE register1 SET password = '${hash}' WHERE email = '${eeemail}'`,
          (error, results) => {
            if (error) {
              return res.status(500).json({ message: error.message });
            }
            res.status(200).json({ message: 'Password updated successfully' });
          }
        );
      }
    );
}
