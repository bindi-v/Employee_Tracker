const express = require('express');
const inquirer = require('inquirer');
// Import and require mysql2
const mysql = require('mysql2');
const { start } = require('repl');

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
    password: '',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect(function(err){
    if(err) throw err;
    start()
});

function start(){
    inquirer.prompt([
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
    }
])
.then(function(answer){
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
    db.query(sql, function(err, res){
        console.log('DEPARTMENTS:');
        res.forEach(department => {
            console.log(`ID: ${department.id} | Name: ${department.name}`)
        })
        start();
    });
};