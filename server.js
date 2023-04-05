const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const cTabole = require('console.table');
const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: 'employee_trackerDB'
    },
    console.log('Connected to the employee_trackeDB')
)

const questionPrompt = () => {
    inquirer
        .prompt ([
        {
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
        }
    ]).then(function ({option})  {
        switch (option) {
            case 'View All Departments':
                viewDept();
                break;

            case 'Veiw All Roles':
                viewRoles();
                break;

            case 'View All Employees':
                viewEmployees();
                break;

            case 'Add a Department':
                addDept();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Quit':
                db.end();
                console.log('Connection broken');
                break
        }
    });
}

questionPrompt();

const viewDept = () => {
    db.query('SELECT department.dept_id AS ID, department.dept_name AS Department FROM department',(err, res) => {
        if (err) throw err
        console.table(res);
        questionPrompt();
    })
}

const viewRoles = () => {
    db.query('SELECT roles.role_id AS ID, roles.title AS Title, department.dept_name AS Department, roles.salary AS Salary FROM roles JOIN department ON roles.department_id = department.dept_id', (err, res) => {
        if (err) throw err;
        
        console.table(res);
        questionPrompt();
    })
}

const viewEmployees = () => {
    
}
