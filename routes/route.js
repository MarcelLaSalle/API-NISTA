const express = require('express');
const router = express.Router();
const controller = require('../controller/controller');
const controller2 = require('../controller/controller2');
const controllerCocina = require('../controller/controllerMenu')
const middleware = require('../middleware/middleware');

// router.post('/sendContact', controller.nodemailerthing);
// router.post('/nodemailerNewPassword', controller2.nodemailerNewPassword);

// router.post('/register', controller2.crearRegistro);
// router.post('/loginWT', controller2.loginWT);
// router.post('/updateBBDDNewPassword', controller2.updateBBDDNewPassword);
// router.post('/recuperarcoontramamon',controller2.tokenRecuperacionPasswd);
// router.get('/protected', middleware.protectedMidd, controller2.tokenAcceso);

router.post('/producto', controller.addProducto);

module.exports = router;