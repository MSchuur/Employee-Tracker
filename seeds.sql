INSERT INTO department (dept_name)
VALUES  ('Sales'),
        ('Engineering'),
        ('Finance'),
        ('Legal');

<<<<<<< HEAD
INSERT INTO roles (title, salary, department)
=======
INSERT INTO roles (title, salary, department_id)
>>>>>>> da609c614de5c308ef79b51c04258ec3e54cabc0
VALUES  ("Sales Lead", 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 2),
        ('Software Engineer', 120000, 2),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 4),
        ('Lawyer', 190000, 4);

INSERT INTO `employees` (first_name, last_name, role_id, manager_id)
VALUES  ('John', 'Doe', 1, null),
        ('Mike', 'Chan', 2, 1),
        ('Ashley', 'Rodriguez', 3, null),
        ('Kevin', 'Tupik', 4, 3),
        ('Kumal', 'Singh', 5, null),
        ('Malia', 'Brown', 6, 5),
        ('Sarah', 'Lourd', 7, null),
        ('Tom', 'Allen', 8, 7);

    
