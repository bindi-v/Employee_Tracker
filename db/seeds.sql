INSERT INTO department (name)
VALUES ("Finance"),
       ("Information Technology"),
       ("Sales"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 100000, 3),
        ("Lead Engineer", 150000, 2),
        ("Software Engineer", 120000, 2),
        ("Account Manager", 160000, 1),
        ("Legal Team Lead", 250000, 4),
        ("Accountant", 125000, 1),
        ("Lawyer", 190000, 4),
        ("Sales Team Lead", 110000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 1, NULL),
       ("Ashley", "Rodriguez", 2, NULL),
       ("Kevin", "Tupik", 3, NULL),
       ("Kunal", "Singh", 4, NULL),
       ("Malia", "Brown", 5, NULL),
       ("Sarah", "Lourd", 6, NULL),
       ("Tom", "Allen", 7, NULL),
       ("John", "Doe", 8, NULL);