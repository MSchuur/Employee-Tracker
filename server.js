const inquirer = require('inquirer');
const mysql = require('mysql');

const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'employee_db'
    }
)