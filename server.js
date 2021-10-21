const express = require('express');

const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    
    // MySQL username,
    user: 'root',

    // Add MySQL password here
    password: 'Jashu&Champa@2784',

    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect((err) => {
    if(err) throw err;
    start();
});

function start(){
    inquirer.prompt(
        {
       type: 'list',
       name: 'action',
       message: "What would you like to do?",
       choices: [
           'View all Departments',
           'View all Roles',
           'View all Employees',
           'Add a Department',
           'Add a Role',
           'Add an Employee',
           "Update an Employee's Role",
           'Exit'
       ]
    })
.then((answer) => {
    if(answer.action === 'View all Departments'){
        viewDepartments();
    }else if(answer.action === 'View all Roles'){
        viewRoles();
    }else if(answer.action === 'View all Employees'){
        viewEmployees();
    }else if (answer.action === 'Add a Department'){
        addDepartment();
    }else if(answer.action === 'Add a Role'){
        addRole();
    }else if(answer.action === 'Add an Employee'){
        addEmployee();

    }else if(answer.action === "Update an Employee's Role"){
        updateRole();
    }else if(answer.action === 'Exit'){
        db.end();
    }
})
}

function viewDepartments() {
    const sql = "SELECT * FROM department";
    db.query(sql, (err, res) => {
        console.log(`DEPARTMENTS: `);
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`)
        })
        start();
    });
};

function viewRoles(){
    const sql = "SELECT * FROM role";
    db.query(sql, (err, res) => {
        console.log(`ROLES: `);
        res.forEach(role => {
            console.log(`ID: ${role.id} | Title: ${role.title} | Salary: ${role.salary} | Department ID: ${role.department_id}`);
        })
        start();
    });

};

function viewEmployees(){
    const sql = "SELECT * FROM employee";
    db.query(sql, (err, res) => {
        console.log(`Employees: `);
        res.forEach(employee => { 
            console.log(`ID: ${employee.id} | Name: ${employee.first_name} ${employee.last_name} | Role ID: ${employee.role_id} | Manager ID: ${employee.manager_id}`);
        })
        start();
    });
 };

 function addDepartment() {
     inquirer.prompt({
         type: 'input',
         name: 'department',
         message: "What id the name of the new Department?",
     })
     .then((answer) => {
         const sql = "INSERT INTO department.name VALUES = ?";
         db.query(sql, answer.department, (err, res) =>{
         console.log(`You have added this department : ${(answer.department).toUpperCase()}`);

         })
         viewDepartments();
     })
 }

 function addRole(){
     
     db.query("SELECT * FROM department", (err, res) => {
         if(err) throw err;
         inquirer.prompt([
             {
                 type: 'input',
                 name: 'title',
                 message: "What is the Title of the new Role?"
             }, {
                 type: 'input',
                 name: 'salary',
                 message: "What is the Salary of the new Role?"
             }, {
                 type: 'list',
                 name: 'departmentName',
                 message: "Which department belongs to this Role?",
                 choices: function(){
                     const choiceArray = [];
                     res.forEach(res => {
                         choiceArray.push(res.name);
                     })
                     return choiceArray;
                 }
             }
         ])
         .then((answer) =>{
             const department = answer.departmentName;
             db.query(`SELECT * FROM DEPARTMENT`, (err, res) => {
                if(err) throw err;
                let filteredDept = res.filter((res) => {
                    return res.name == department;
                })
                let id = filteredDept[0].id;
                let sql = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                let values = [answer.title, parseInt(answer.salary), id]
                console.log(values);
                db.query(sql, values, (err, res, fields) => {
                    console.log(`You have added this role: ${(values[0]).toUpperCase()}`)
                })
                viewRoles();
             })
         })

         })
 }

 async function addEmployee() {
     db.query("SELECT * FROM role", (err, res) => {
        if(err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the Employee's first name?"
            }, {
                type: 'input',
                name: 'lastName',
                message: "What is the Employee's last name?"
            }, {
                type: 'list',
                name: 'roleName',
                message: "What is an Employee's role? ",
                choices: function() {
                    rolesArray = [];
                    res.forEach(res => {
                        rolesArray.push(res.title);
                    })
                    return rolesArray;
                }
            }
        ])
        .then((answer) => {
            console.log(answer);
            const role = answer.roleName;
            db.query("SELECT * FROM role", (err, res) => {
                if(err) throw err;
                let filteredRole = res.filter((res) => {
                    return res.title == role;
                })
                let roleId = filteredRole[0].id;
                db.query("SELECT * FROM employee", (err, res) => {
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'manager',
                            message: "Who is the Manager?",
                            choices: function(){
                                managersArray = [];
                                res.forEach(res => {
                                    managersArray.push(res.last_name)
                                })
                                return managersArray;
                            }
                        }
                    ])
                    .then((managerAns) => {
                        const manager = managerAns.manager;
                        db.query("SELECT * FROM employee", (err, res) => {
                            if(err) throw err;
                            let filteredManager = res.filter((res) => {
                                return res.last_name == manager;
                            }) 
                            let managerId = filteredManager[0].id;
                            console.log(managerAns);
                            const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?)";
                            const values = [answer.firstName, answer.lastName, roleId, managerId];
                            console.log(values);
                            db.query(sql, values, (err, res, fields) => {
                                console.log(`You have added an Employee: ${values[0].toUpperCase()}`);
                            })
                            viewEmployees();
                        })
                    })
                })
            })
        })
     })
 }
