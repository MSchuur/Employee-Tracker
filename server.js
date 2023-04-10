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
            "View All Departments",
            "Veiw All Roles",
            "View All Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update an Employee's Role",
            "Update an Employee's Manager",
            "View Employee(s) by Department",
            "View Employee(s) by Manager",
            "View Budget by Department",
            "Delete Department",
            "Delete Role",
            "Delete Employee",
            'Quit'
        ]
        }
    ]).then(function ({option})  {
        // Call the appropriate function when the option is chosen
        switch (option) {
            case "View All Departments":
                viewDept();
                break;

            case "Veiw All Roles":
                viewRoles();
                break;

            case "View All Employees":
                viewEmployees();
                break;

            case "Add a Department":
                addDept();
                break;

            case "Add a Role":
                addRole();
                break;

            case "Add an Employee":
                addEmployee();
                break;

            case "Update an Employee's Role":
                updateEmployee();
                break;

            case "Update an Employee's Manager":
                updateManager ();
                break;

            case "View Employee(s) by Department":
                viewEmployeebyDept();
                break;
            
            case "View Employee(s) by Manager":
                viewEmployeebyManager();
                break;

            case "View Budget by Department":
                viewBudgetByDept();
                break;

            case "Quit":
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
const roleQuery = () =>{
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

// Create the Promise to return the employee query from the DataBase to be used in the View Employee function
const viewManagerQuery = () =>{
    return new Promise((resolve, reject)=>{
        db.query('SELECT e.employee_id AS ID, CONCAT(e.first_name, " ", e.last_name) AS Employee, CONCAT(m.first_name, " ", m.last_name) AS Manager, e.manager_id AS Manager_ID FROM employees e LEFT JOIN employees m ON m.employee_id = e.manager_id',  (err, res)=>{
            if(err){
                return reject(err);
            }
            return resolve(res);
        });
    });
};

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
        const result = await roleQuery();
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

// Calls the function to add a new department
const addDept = () => {
    inquirer.prompt ([
        {
            name: 'dept_name',
            type: 'input',
            message: 'What is the Department you would like to add?'
        }
    ]).then(function(res) {
        // The SQL statement to inserts the new department into the department list
        db.query(`INSERT INTO department (dept_name) VALUES ("${res.dept_name}") `, (err, res) => {
            if (err) throw err;
            console.log('\n');
            console.log('Department added\n');
            questionPrompt();
        });
    });
};

// Calls the Promise from the department query to add a new role
const addRole = async () => {
    try{
        const result = await deptQuery();
        const deptNameArr = [];
        const deptIdArr = [];
        // Creates the list of department names for the inquirer list
        result.forEach((department) => {deptNameArr.push(department.Department), deptIdArr.push(department.ID);});
        
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
            // Changes the Department Name selected in the inquirer list to the Department Id to be inserted into the roles table
            for(i = 0; i < deptNameArr.length; i++) {
                if (res.dept_name === deptNameArr[i]) {
                    res.dept_name = deptIdArr[i];

                    // The SQL statement to inserts the new role into the roles list
                    db.query(`INSERT INTO roles (title, salary, department_id) VALUES ("${res.title}", ${res.salary}, ${res.dept_name} ) `, (err, res) => {
                        if (err) throw err;
                        console.log('\n');
                        console.log('Role added\n');
                        questionPrompt();
                    });
                };
            };
        });
    } catch(error){
        console.log(error)
    };
};

// Calls the Promise from the role query and the employee query to add a new employee
const addEmployee = async () => {
    try{
        const result1 = await roleQuery();
        const roleTitleArr = [];
        const roleIdArr = [];
        // Creates the list of role titles for the inquirer list
        result1.forEach((roles) => {roleTitleArr.push(roles.Title), roleIdArr.push(roles.ID);});
        
        const result2 = await viewEmployeeQuery();
        const managerNameArr = [];
        const managerIdArr = [];
        // Creates the list of manager name for the inquirer list
        result2.forEach((employees) => {managerIdArr.push(employees.ID), managerNameArr.push(employees.Employee) ;});
                    
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
            // Changes the Role Title selected in the inquirer list to the Role Id to be inserted into the employees table
            for(i = 0; i < roleTitleArr.length; i++) {
                if (res.role_id === roleTitleArr[i]) {
                    res.role_id = roleIdArr[i];
                };
            };
            // Changes the Manager Name selected in the inquirer list to the Manager Id to be inserted into the employees table
            for(i = 0; i < managerNameArr.length; i++) {
                if (res.manager_id === managerNameArr[i]) {
                    res.manager_id = managerIdArr[i];
                };
            };
            // The SQL statement to inserts the new employee into the roles list
            db.query(`INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id}, ${res.manager_id})`, (err, res) => {
                if (err) throw err;
                console.log('\n');
                console.log('New Employee added\n');
                questionPrompt();
            });
        });
    } catch(error){
        console.log(error)
    };
}

// Calls the Promise from the View Employee query and the Roles Query to update the role of an employee
const updateEmployee = async () => {
    try{
        const result1 = await viewEmployeeQuery();
        const employeeNameArr = [];
        const employeeIdArr = [];
        // Creates the list of manager name for the inquirer list
        result1.forEach((employees) => {employeeNameArr.push(employees.Employee), employeeIdArr.push(employees.ID);});
           
        const result2 = await roleQuery();
        const roleTitleArr = [];
        const roleIdArr = [];
        // Creates the list of role titles for the inquirer list
        result2.forEach((roles) => {roleTitleArr.push(roles.Title), roleIdArr.push(roles.ID);});
        
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
                // Changes the Employee Name selected in the inquirer list to the Employee Id to be to used to change the employee table
                for(i = 0; i < employeeNameArr.length; i++) {
                    if (res.employee_id === employeeNameArr[i]) {
                        res.employee_id = employeeIdArr[i];
                    };
                };
                // Changes the Role Title selected in the inquirer list to the Role Id to be inserted into the employees table
                for(i = 0; i < roleTitleArr.length; i++) {
                    if (res.role_id === roleTitleArr[i]) {
                        res.role_id = roleIdArr[i];
                    };
                };
                // The SQL statement to insert the new role into the employees table
                db.query(`UPDATE employees SET role_id = ${res.role_id} WHERE employee_id = ${res.employee_id}`, (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.log('Employee Role Updated\n');
                    questionPrompt();
                    });
            });
    } catch(error){
    console.log(error)
    };
}

// Calls the Promise from the View Employee query to update the Manager of an employee
const updateManager = async () => {
    try{
        const result1 = await viewEmployeeQuery();
        const employeeNameArr = [];
        const employeeIdArr = [];
        // Creates the list of manager name for the inquirer list
        result1.forEach((employees) => {employeeNameArr.push(employees.Employee), employeeIdArr.push(employees.ID);});
           
        const result2 = await viewEmployeeQuery();
        const managerNameArr = [];
        const managerIdArr = [];
        // Creates the list of role titles for the inquirer list
        result2.forEach((employees) => {managerNameArr.push(employees.Employee), managerIdArr.push(employees.ID);});
        
        inquirer.prompt([
            {
                name: 'employee_id',
                type: 'list',
                message: 'Select an employee to their role?',
                choices: employeeNameArr
            },
            {
                name: 'manager_id',
                type: 'list',
                message: "Who is the employee's new Manager?",
                choices: managerNameArr
            }
                
            ]).then((res) => {
                // Changes the Employee Name selected in the inquirer list to the Employee Id to be to used to change the employee table
                for(i = 0; i < employeeNameArr.length; i++) {
                    if (res.employee_id === employeeNameArr[i]) {
                        res.employee_id = employeeIdArr[i];
                    };
                };
                // Changes the Role Title selected in the inquirer list to the Role Id to be inserted into the employees table
                for(i = 0; i < managerNameArr.length; i++) {
                    if (res.manager_id === managerNameArr[i]) {
                        res.manager_id = managerIdArr[i];
                    };
                    // Sets the Manager Id to null if the Employee and Manager Id are the same
                    if (res.manager_id === res.employee_id) {
                        res.manager_id = null;
                    };
                };
                // The SQL statement to insert the new role into the employees table
                db.query(`UPDATE employees SET manager_id = ${res.manager_id} WHERE employee_id = ${res.employee_id}`, (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.log('Employee Manager Updated\n');
                    questionPrompt();
                    });
            });
    } catch(error){
    console.log(error)
    };
}

// Calls the Promise from the View Department to get the Department ID
const viewEmployeebyDept = async () => {
    try{
        const result = await deptQuery();
        const deptNameArr = [];
        const deptIdArr = [];
        // Creates the list of Departments for the inquirer list
        result.forEach((department) => {deptNameArr.push(department.Department), deptIdArr.push(department.ID)});
        
        inquirer.prompt([
            {
                name: 'department_id',
                type: 'list',
                message: "From which Department to you wish to see the Employee(s)?",
                choices: deptNameArr
            }
            ]).then((res) => {
                console.log(res.department_id)
                // Set Department Name as the Department Id
                for(i = 0; i < deptNameArr.length; i++) {
                    if (res.department_id === deptNameArr[i]) {
                        res.department_id = deptIdArr[i];
                    };
                };
                // Creates a the SQL statement as a variable to be called later
                 const deptQuery = `SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee FROM employees e JOIN roles r ON e.role_id = r.role_id JOIN department d ON r.department_id = d.dept_id WHERE d.dept_id = ${res.department_id};`;
                
                // Calls the variable with the SQL statement and uses the result from the inquirer prompt
                db.query (deptQuery, (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.table(res);
                    questionPrompt();
                });
            });
    } catch(error){
    console.log(error)
    };
}

// Calls the Promise from the View Employee by Manager query
const viewEmployeebyManager = async () => {
    try{
        const result = await viewManagerQuery();
        const managerNameArr = [];
        const managerIdArr = [];
        // Creates the list of Managers for the inquirer list
        result.forEach((employees) => {
            if(employees.Manager_ID === null) {
                managerNameArr.push(employees.Employee), managerIdArr.push(employees.ID);
            }
        });
        
        inquirer.prompt([
            {
                name: 'manager_id',
                type: 'list',
                message: "Which Manager to you wish to see their Employee(s)?",
                choices: managerNameArr
            }
            ]).then((res) => {
                // Set Manager Name as the Manager Id
                for(i = 0; i < managerNameArr.length; i++) {
                    if (res.manager_id === managerNameArr[i]) {
                        res.manager_id = managerIdArr[i];
                    };
                };
                // Creates a the SQL statement as a variable to be called later
                 const manQuery = `SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee FROM employees e where manager_id = ${res.manager_id};`;
                
                // Calls the variable with the SQL statement and uses the result from the inquirer prompt
                db.query (manQuery, (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.table(res);
                    questionPrompt();
                });
            });
    } catch(error){
    console.log(error)
    };
}

// Calls the Promise from the Department query to get the Department Id
const viewBudgetByDept = async () => {
    try{
        const result = await deptQuery();
        const deptNameArr = [];
        const deptIdArr = [];
        // Creates the list of Departments for the inquirer list
        result.forEach((department) => {deptNameArr.push(department.Department), deptIdArr.push(department.ID)});
                
        inquirer.prompt([
            {
                name: 'dept_id',
                type: 'list',
                message: "From which Department to you wish to see the Budget?",
                choices: deptNameArr
            }
            ]).then((res) => {
                // Set Manager Name as the Manager Id
                for(i = 0; i < deptNameArr.length; i++) {
                    if (res.dept_id === deptNameArr[i]) {
                        res.dept_id = deptIdArr[i];
                    };
                };
                // Creates a the SQL statement as a variable to be called later
                 const budgetQuery = `SELECT SUM(r.salary) AS BUDGET FROM roles r JOIN department d ON r.department_id = d.dept_id WHERE d.dept_id = ${res.dept_id};`;
                
                // Calls the variable with the SQL statement and uses the result from the inquirer prompt
                db.query (budgetQuery, (err, res) => {
                    if (err) throw err;
                    console.log('\n');
                    console.table(res);
                    questionPrompt();
                });
            });
    } catch(error){
    console.log(error)
    };
}
questionPrompt();