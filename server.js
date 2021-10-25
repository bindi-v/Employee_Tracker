//const express = require('express');

const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const cTable = require('console.table');


//const PORT = process.env.PORT || 3001;
//const app = express();

// Express middleware
//app.use(express.urlencoded({ extended: false }));
//app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    
    // MySQL username,
    user: 'root',

    // Add MySQL password here
    password: 'Jashu&Champa@2784',

    database: 'employees_db',
    
    port: 3306
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
         return db.end();
    }
})
};

function viewDepartments() {
    const sql = "SELECT id AS Id, name AS Department FROM department";
    db.query(sql, (err, res) => {
        if(err) throw err;
       // console.log(`Departments: `);
       // res.forEach(department => {
        //    console.log(`Id: ${department.id} | Name: ${department.name}`);
        console.table(res);
        start();
        })
    //});
};

function viewRoles(){
    const sql = "SELECT role.id AS Id, role.title AS Title, role.salary AS Salary, role.department_id AS Department FROM role";
    //"SELECT * FROM role";

    db.query(sql, (err, res) => {
        if(err) throw err;
        //console.log(`Roles: `);
       // console.table(`Roles:`);
      // res.forEach(role => {
       // console.log(`Id: ${role.id}  | Title: ${role.title} | Salary: ${role.salary} | Department: ${role.department_id}`);
        
       // })
        console.table(res);
        start();
    });

};

function viewEmployees(){
    const sql = `SELECT employee.id AS Id,
                        employee.first_name As First_Name,
                        employee.last_name AS Last_Name, 
                        role.title AS Title, 
                        role.salary AS Salary, 
                        name AS Department,
                        CONCAT (manager.first_name, ' ', manager.last_name) AS Manager
                FROM employee 
                        LEFT JOIN role ON role_id = role.id 
                        LEFT JOIN department ON department_id = Department.id  
                        LEFT JOIN employee manager ON employee.manager_id = Manager.id`;

    db.query(sql, (err, res) => {
        if(err) throw err;
       // console.log(`Employees: `);
       // res.forEach(employee => { 
      // console.log(`Id: ${employee.id}  | Name: ${employee.first_name} ${employee.last_name}`);
      // })
       console.table(res);
        start();
    });
 };

 function addDepartment() {
     inquirer.prompt({
         type: 'input',
         name: 'addDepartment',
         message: "What is the name of the new Department?",
     })
     .then((answer) => {
         const sql = `INSERT INTO department (name) VALUES (?)`;
         db.query(sql, answer.addDepartment, (err, res) =>{
            if(err) throw err;
         console.log(`You have added this department : ${(answer.addDepartment)}`);
          // console.table(res);
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
                const filteredDept = res.filter((res) => {
                    return res.name == department;
                })
                const id = filteredDept[0].id;
                const sql = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";
                const values = [answer.title, parseInt(answer.salary), id]
                console.log(values);
                db.query(sql, values, (err, res) => {
                    console.log(`You have added this role: ${values[0].toUpperCase()}`);
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
                            const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                            const values = [answer.firstName, answer.lastName, roleId, managerId];
                            console.log(values);
                            db.query(sql, values, (err, res) => {
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
function updateRole(){
    db.query("SELECT * FROM employee", (err, res) => {
        if(err) throw err;
        inquirer.prompt([
            {
                type: 'list',
                name: 'employeeName',
                message: "Which employee's role is updating?",
                choices: function(){
                    employeeArray = [];
                    res.forEach(res => {
                        employeeArray.push(res.last_name);
                    })
                    return employeeArray;
                }
            }
        ])
        .then((answer) => {
            console.log(answer);
            const name = answer.employeeName;
            db.query("SELECT * FROM employee", (err, res) => {
                if(err) throw err;
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'role',
                        message: "What is the employee's role?",
                        choices: function(){
                            rolesArray = [];
                            res.forEach(res => {
                                rolesArray.push(res.title);
                            })
                            return rolesArray;
                        }
                    }
                ])
                .then((rolesAns) => {
                    const role = rolesAns.role;
                    console.log(rolesAns.role);
                    db.query("SELECT * FROM role WHERE title = ?", [role], (err, res) => {
                        if(err) throw err;
                        let roleId = res[0].id; 
                        
                        console.log(roleId);

                        const sql = "UPDATE employee SET role_id WHERE last_name ?";
                        const values = [roleId, name];
                        console.log(values);
                        db.query(sql, values, (err, res, fields) => {
                            console.log(`You have updated ${name}'s role to ${role}`);
                        })
                        viewEmployees();
                    })
                })
            })
        })
    })
};