-- Requests for create database

CREATE TABLE jobsDepartments 
( jobDepartmentId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
name VARCHAR(20) NOT NULL 
);
CREATE TABLE jobs 
( jobId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
name VARCHAR(20) NOT NULL, 
jobDepartmentId INTEGER NOT NULL, 
permissionLevel VARCHAR(2) NOT NULL, 
FOREIGN KEY(jobDepartmentId) REFERENCES jobsDepartments(jobDepartmentId) 
);
CREATE TABLE superiors 
( superiorId INTEGER NOT NULL, 
jobId INTEGER NOT NULL, 
FOREIGN KEY(superiorId) REFERENCES jobs(jobId), 
FOREIGN KEY(jobId) REFERENCES jobs(jobId) 
);
CREATE TABLE employees 
( employeeId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
lastname VARCHAR(20) NOT NULL, 
firstname VARCHAR(20) NOT NULL, 
jobId INTEGER NOT NULL, 
birthDate DATE NOT NULL, 
hireDate DATE NOT NULL, 
salary FLOAT NOT NULL, 
email VARCHAR(50), 
FOREIGN KEY(jobId) REFERENCES jobs(jobId) 
);
CREATE TABLE accounts 
( accountId INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
employeeId INTEGER NOT NULL, 
email VARCHAR(50) NOT NULL, 
password VARCHAR(20) NOT NULL, 
FOREIGN KEY(employeeId) REFERENCES employees(employeeId), 
FOREIGN KEY(email) REFERENCES employees(email) 
);

