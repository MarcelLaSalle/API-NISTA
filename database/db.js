const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'sojadb'
});

module.exports = db;

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('MySQL Connected...');
});
