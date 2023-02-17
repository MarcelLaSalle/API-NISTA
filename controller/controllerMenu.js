const db = require('../database/db');

module.exports.addProducto = function (req, res) {
    let nombre_producto = req.body.nombre_producto;
    let tipo_producto = req.body.tipo_producto;

    let data = {nombre_producto: nombre_producto, tipo_producto: tipo_producto};
    sql = "INSERT INTO productos SET ?";
    query = db.query(sql, data, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
}