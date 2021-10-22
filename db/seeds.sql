INSERT INTO department (name)
VALUES ("Finance"),
       ("Information Technology"),
       ("Sales"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 100, 3),
        ("Lead Engineer", 150, 2),
        ("Software Engineer", 120, 2),
        ("Account Manager", 160, 1),
        ("Legal Team Lead", 250, 4),
        ("Accountant", 125, 1),
        ("Lawyer", 190, 4),
        ("Sales Team Lead", 110, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 1, NULL),
       ("Ashley", "Rodriguez", 2, NULL),
       ("Kevin", "Tupik", 3, NULL),
       ("Kunal", "Singh", 4, NULL),
       ("Malia", "Brown", 5, 8),
       ("Sarah", "Lourd", 6, NULL),
       ("Tom", "Allen", 7, 4),
       ("John", "Doe", 8, NULL);