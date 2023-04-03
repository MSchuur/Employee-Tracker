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

const questionPromt = () => {
    inquirer
        .prompt ({
        type: 'list' ,
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            'View All Departments',
            'Veiw All Roles',
            'View All Employees',
            'Add a Department',
            'Add Role',
            'Add Employee',
            'Quit'
        ]
    })
    .then((option) => {

    })



}