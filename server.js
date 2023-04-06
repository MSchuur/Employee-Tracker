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
    db.query('SELECT d.dept_id AS ID, d.dept_name AS Department FROM department d',(err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('DEPARTMENTS\n');
        console.table(res);
        questionPrompt();
    })
}

const viewRoles = () => {
    db.query('SELECT r.role_id AS ID, r.title AS Title, d.dept_name AS Department, r.salary AS Salary FROM roles r JOIN department d ON r.department_id = d.dept_id', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('ROLES\n');
        console.table(res);
        questionPrompt();
    })
}

const viewEmployees = () => {
    db.query('SELECT e.employee_id AS ID, e.first_name AS First, e.last_name AS Last, r.title As Position, d.dept_name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees e JOIN roles r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id LEFT JOIN employees m ON m.employee_id = e.manager_id', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('EMPLOYEES\n');
        console.table(res);
        questionPrompt();
    })
}


