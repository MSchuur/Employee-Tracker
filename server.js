const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employee_db'
    }
)

const questionPrompt = () => {
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
    .then((response) => {
        switch (response) {
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
                connection.end();
                break
        }
    });
}

const viewDept = () => {

}


