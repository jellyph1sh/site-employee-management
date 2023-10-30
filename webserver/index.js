const express = require('express');
const Database = require('./Database');
const cors = require('cors');
const generatePasswd = require('generate-password');
const crypto = require('crypto');

const PORT = 3001;

const generatePassword = (charLen) => {
    return generatePasswd.generate({ 
        length: charLen, 
        numbers: true
    })
}

const hashPassword = (algorithm, base, passwd) => {
    return crypto.createHash(algorithm).update(passwd).digest(base);
}

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Allow all origins for demonstration purposes.
app.use(cors());

app.get('/', (req, res) => {
    res.json({ message: 'Hello from server!' });
});

app.post('/employee', async (req, res) => {
    const emp = req.body;
    let err = await Database.Write('company.db', 'INSERT INTO Employees (name, firstName, jobId, birthDate, hireDate, salary, mail) VALUES (?, ?, ?, ?, ?, ?, ?);', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary, emp.email);
    if (err != null) {
        res.json({status: false});
        return;
    }
    let username = emp.lastname + emp.firstname
    const password = hashPassword(generatePassword(16))
    const empMore = await Database.Read('company.db', 'SELECT employeeId FROM Employees WHERE name = ? AND firstName = ? AND mail = ?;', emp.lastname, emp.firstname, emp.email);
    err = await Database.Write('company.db', 'INSERT INTO Accounts (employeeId, userName, mail, password) VALUES (?, ?, ?, ?);', empMore[0].employeeId, username, emp.email, password);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.post('/job', async (req, res) => {
    const job = req.body;
    const err = await Database.Write('company.db', 'INSERT INTO Jobs (name, jobDepartmentId, permissionLevel) VALUES (?, ?, ?);', job.jobName, parseInt(job.jobDepartmentId), job.permissionLevel);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true});
})

app.post('/isValidUser', async (req, res) => {
    const emp = req.body;
    let user = await Database.Read('company.db', 'SELECT Jobs.permissionLevel FROM Accounts JOIN Employees ON Employees.employeeId = Accounts.employeeId JOIN Jobs ON Jobs.jobId = Employees.jobId WHERE Accounts.mail = ? AND Accounts.password = ?;', emp.email, emp.password);
    if (user.length == 0) {
        res.json({exist: false});
        return;
    }
    res.json({permission: user[0].permissionLevel});
})

app.put('/updateEmployee', async (req, res) => {
    const emp = req.body;
    const err = await Database.Write('company.db', 'UPDATE Employees SET name = ?, firstName = ?, jobId = ?, birthDate = ?, hireDate = ?, salary = ?, mail = ? WHERE employeeId = ?;', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary, emp.email, emp.idEmployee);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.put('/updateJob', async (req, res) => {
    const job = req.body;
    const err = await Database.Write('company.db', 'UPDATE Jobs SET name = ?, jobDepartmentId = ?, permissionLevel = ? WHERE jobId = ?', job.name, job.jobDepartmentId, job.permissionLevel,job.jobId);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.get('/employees', async (req, res) => {
    let employees = await Database.Read('company.db', 'SELECT Employees.employeeId, Employees.name, Employees.firstName, Employees.mail, Employees.birthDate, Employees.hireDate, Jobs.name AS jobName, Employees.salary,Jobs.jobId FROM Employees LEFT JOIN Jobs ON Jobs.jobId = Employees.jobId;');
    res.json(employees);
})

app.get('/jobs', async (req, res) => {
    let jobs = await Database.Read('company.db', 'SELECT Jobs.jobId, Jobs.name AS jobName, Jobs.jobDepartmentId, JobsDepartments.name AS departmentName FROM Jobs JOIN JobsDepartments ON JobsDepartments.jobDepartmentId = Jobs.jobDepartmentId;');
    res.json(jobs);
})

app.get('/jobsDepartments', async (req, res) => {
    let jobsDepartments = await Database.Read('company.db', 'SELECT * FROM JobsDepartments;');
    res.json(jobsDepartments);
})

app.listen(PORT, () => {
    console.log('Server started ! http://localhost:3001');
    console.log(`Server now listening on ${PORT}`);
})