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
            'Add a Role',
            'Add an Employee',
            'Update an Employee',
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

            case 'Add a Role':
                addRole();
                break;

            case 'Add an Employee':
                addEmployee();
                break;

            case "Update an Employee's Role":
                updateEmployee();
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
    db.query('SELECT e.employee_id AS ID, CONCAT(e.first_name, " ", e.last_name) AS Employee, r.title As Position, d.dept_name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees e JOIN roles r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id LEFT JOIN employees m ON m.employee_id = e.manager_id', (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('EMPLOYEES\n');
        console.table(res);
        questionPrompt();
    })
}

const addDept = () => {
    inquirer.prompt ([
        {
            name: 'dept_name',
            type: 'input',
            message: 'What is the Department you would like to add?'
        }
    ]).then(function(res) {
        db.query(`INSERT INTO department (dept_name) VALUES ("${res.dept_name}") `, (err, res) => {
            if (err) throw err;
            console.log('\n');
            console.log('Department added\n');
            questionPrompt();
        });
    });
}

const addRole = () => {
    const deptNameArr = [];
    const deptIdArr = [];
    db.query('SELECT * FROM department', (err, res) => {
        if (err) throw err;
        res.forEach((department) => {deptNameArr.push(department.dept_name), deptIdArr.push(department.dept_id);});
        return deptNameArr
    });
     
    inquirer.prompt ([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role?'
        },
        {
            name: 'salary',
            type: 'number',
            message: 'What is the annual salary for this role?'
        },
        {
            name: 'dept_name',
            type: 'list',
            message: 'What department is the new role in?',
            choices: deptNameArr
        }
    ]).then((res) => {
        for(i = 0; i < deptNameArr.length; i++) {
            if (res.dept_name === deptNameArr[i]) {
                res.dept_name = deptIdArr[i];
                db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${res.title}", ${res.salary}, ${res.dept_name} ) `, (err, res) => {
                    if (err) throw err;
                    console.log('Role added\n');
                    questionPrompt();
                });
            };
        };
    });
}

const addEmployee = () => {
    // Create Arrays for the role title for the inquirer prompt list and role ID for the SQL insert into Employees table 
    const roleTitleArr = [];
    const roleIdArr = [];
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        res.forEach((roles) => {roleTitleArr.push(roles.title), roleIdArr.push(roles.role_id);});
        return roleTitleArr;
    });

    const managerNameArr = [];
    const managerIdArr = [];
    db.query('SELECT e.manager_id, CONCAT(e.first_name, " ", e.last_name) AS Manager, e.employee_id  FROM employees e LEFT JOIN employees m ON m.employee_id = e.manager_id', (err, res) => {
        if (err) throw err;
        res.forEach((employees) => {managerIdArr.push(employees.employee_id), managerNameArr.push(employees.Manager) ;});
        return managerNameArr;
    })

    inquirer.prompt ([
        {
            name: 'first_name',
            type: 'input',
            message: 'What is the First name of the new employee?'
        },
        {
            name: 'last_name',
            type: 'input',
            message: 'What is the Last name of the new employee?'
        },
        {
            name: 'role_id',
            type: 'list',
            message: 'What is the role the new employee will be filling?',
            choices: roleTitleArr
        },
        {
            name: 'manager_id',
            type: 'list',
            message: "Who will be new employee's manager?",
            choices: managerNameArr
        },
    ]).then((res) => {
        for(i = 0; i < roleTitleArr.length; i++) {
            if (res.role_id === roleTitleArr[i]) {
                res.role_id = roleIdArr[i];
            };
        };

        for(i = 0; i < managerNameArr.length; i++) {
            if (res.manager_id === managerNameArr[i]) {
                res.manager_id = managerIdArr[i];
                                
            };
        };
        
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id}, ${res.manager_id})`, (err, res) => {
            if (err) throw err;
            console>log('\n');
            console.log('New Employee added\n');
                questionPrompt();
            });
            
        
    });
}

const updateEmployee = () => {
    // Create Arrays for the role title for the inquirer prompt list and role ID for the SQL insert into Employees table 
    const roleTitleArr = [];
    const roleIdArr = [];
    db.query('SELECT * FROM roles', (err, res) => {
        if (err) throw err;
        res.forEach((roles) => {roleTitleArr.push(roles.title), roleIdArr.push(roles.role_id);});
        return roleTitleArr;
    });
    // Create Arrays for the employee name concatenated and the employee id to be used to update the role 
    const employeeNameArr = [];
    const employeeIdArr = [];
    db.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee, e.employee_id  FROM employees e', (err, res) => {
        if (err) throw err;
        res.forEach((employees) => {employeeIdArr.push(employees.employee_id), employeeNameArr.push(employees.Employee) ;});
        return employeeNameArr;
    })

    inquirer.prompt([
    {
        name: 'empolyee_name',
        type: 'list',
        message: 'Which employee do you wish to change their role?',
        choices: employeeNameArr
    },
    {
        name: 'role_id',
        type: 'list',
        message: "What is the employee's new Role?",
        choices: roleTitleArr
    },
    ]).then((res) => {
        for(i = 0; i < roleTitleArr.length; i++) {
            if (res.role_id === roleTitleArr[i]) {
                res.role_id = roleIdArr[i];
            };
        };

        for(i = 0; i < managerNameArr.length; i++) {
            if (res.employee_id === employeeNameArr[i]) {
                res.employee_id = employeeIdArr[i];
                                
            };
        };
        
        db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id}, ${res.manager_id})`, (err, res) => {
            if (err) throw err;
            console>log('\n');
            console.log('New Employee added\n');
                questionPrompt();
            });
    });
}
