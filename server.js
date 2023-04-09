// Import modules required for the application
const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();
const cTabole = require('console.table');

// Create the connection to the DataBase
const db = mysql.createConnection (
    {
        host: 'localhost',
        user: 'root',
        password: process.env.PASSWORD,
        database: 'employee_trackerDB'
    },
    console.log('Connected to the employee_trackeDB')
)

// Create the function to be called to allow user to scroll through the options 
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
            'Update an Employee Role',
            'Quit'
        ]
        }
    ]).then(function ({option})  {
        // Call the appropriate function when the option is chosen
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

            case 'Update an Employee Role':
                updateEmployee();
                break;

            case 'Quit':
                db.end();
                console.log('Connection broken');
                break
        }
    });
}

// Create the Promise to return the Department querry from the DataBase to be used in the View Department function
const deptQuery = () =>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT d.dept_id AS ID, d.dept_name AS Department FROM department d',  (err, res)=>{
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

// Create the Promise to return the role query from the DataBase to be used in the View Role function
const viewRoleQuery = () =>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT r.role_id AS ID, r.title AS Title, d.dept_name AS Department, r.salary AS Salary FROM roles r JOIN department d ON r.department_id = d.dept_id',  (err, res)=>{
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

// Create the Promise to return the employee query from the DataBase to be used in the View Employee function
const viewEmployeeQuery = () =>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT e.employee_id AS ID, CONCAT(e.first_name, " ", e.last_name) AS Employee, r.title As Position, d.dept_name AS Department, r.salary AS Salary, CONCAT(m.first_name, " ", m.last_name) AS Manager FROM employees e JOIN roles r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id LEFT JOIN employees m ON m.employee_id = e.manager_id',  (err, res)=>{
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

const roleQuery = () =>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT * FROM roles',  (err, res)=>{
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

const employeeName = () =>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee, e.employee_id  FROM employees e',  (err, res)=>{
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

questionPrompt();

// Calls the Promise from the department query and prints Department Table in the CLI
const viewDept = async () => {
    try{
    const result = await deptQuery();
        console.log('\n');
        console.log('DEPARTMENTS\n');
        console.table(result);
        questionPrompt();
    } catch(error){
        console.log(error);
    };
};

// Calls the Promise from the viewRole query and prints the Roles Table in the CLI
const viewRoles = async () => {
    try{
    const result = await viewRoleQuery();
        console.log('\n');
        console.log('ROLES\n');
        console.table(result);
        questionPrompt();
    } catch(error){
        console.log(error);
    };
};

// Calls the Promise from the viewEmployee query and prints the Employees Table in the CLI
const viewEmployees = async () => {
    try{
    const result = await viewEmployeeQuery();
        console.log('\n');
        console.log('EMPLOYEES\n');
        console.table(result);
        questionPrompt();
    } catch(error){
        console.log(error);
    };
};

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




 const updateEmployee = async () => {
    try{
    const result1 = await employeeName();
        const employeeNameArr = [];
        const employeeIdArr = [];
        result1.forEach((employees) => {employeeNameArr.push(employees.Employee), employeeIdArr.push(employees.employee_id);});
        console.log(employeeNameArr);
   
    const result2 = await roleQuery();
        const roleTitleArr = [];
        const roleIdArr = [];
        result2.forEach((roles) => {roleTitleArr.push(roles.title), roleIdArr.push(roles.role_id);});
        console.log(roleTitleArr)

        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select an employee to their role?',
                choices: employeeNameArr
            },
            {
                name: 'role_id',
                type: 'list',
                message: "What is the employee's new Role?",
                choices: roleTitleArr
            }
                
            ]).then((res) => {
                for(i = 0; i < employeeNameArr.length; i++) {
                    if (res.employee_id === employeeNameArr[i]) {
                        res.employee_id = employeeIdArr[i];
                    };
                };
                
                for(i = 0; i < roleTitleArr.length; i++) {
                    if (res.role_id === roleTitleArr[i]) {
                        res.role_id = roleIdArr[i];
                    };
                };
        
                db.query(`UPDATE employees SET role_id = ${res.role_id} WHERE employee_id = ${res.employee_id}`, (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.log('Employee Role Updated\n');
                    questionPrompt();
                    });
            });
    } catch(error){
    console.log(error)
    }
}
