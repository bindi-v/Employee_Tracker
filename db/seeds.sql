INSERT INTO department (name)
VALUES ("Finance"),
       ("Information Technology"),
       ("Sales"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Person", 80, 3),
        ("Lead Engineer", 150, 2),
        ("Software Engineer", 120, 2),
        ("Account Manager", 160, 1),
        ("Legal Team Lead", 250, 4),
        ("Accountant", 125, 1),
        ("Lawyer", 190, 4),
        ("Sales Team Lead", 110, 3);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Mike", "Chan", 3),
       ("Ashley", "Rodriguez", 2),
       ("Kevin", "Tupik", 2),
       ("Kunal", "Singh", 1),
       ("Malia", "Brown", 1),
       ("Sarah", "Lourd", 4),
       ("Tom", "Allen", 4),
       ("John", "Doe", 3);