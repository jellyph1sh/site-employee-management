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

app.post('deleteJob', async (req, res) => {
    const job = req.body;
    const err = await Database.Write('company.db', 'DELETE FROM superiors WHERE superiors.jobId = ?; DELETE FROM employees WHERE employees.jobId = ?; DELETE FROM jobs WHERE jobs.jobId = ?;', job.jobId, job.jobId, job.jobId);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true});
});

app.post('deleteEmployee', async (req, res) => {
    const emp = req.body;
    const err = await Database.Write('company.db', 'DELETE FROM superiors WHERE superiors.employeeId = ?; DELETE FROM accounts WHERE accounts.employeeId = ?; DELETE FROM employees WHERE employees.employeeId = ?;', emp.employeeId, emp.employeeId, emp.employeeId);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true});
})

app.post('/employee', async (req, res) => {
    const emp = req.body;
    let err = await Database.Write('company.db', 'INSERT INTO employees (lastname, firstname, jobId, birthDate, hireDate, salary) VALUES (?, ?, ?, ?, ?, ?);', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary);
    if (err != null) {
        res.json({status: false});
        return;
    }
    const password = hashPassword('sha256', 'base64', generatePassword(16))
    const empMore = await Database.Read('company.db', 'SELECT employeeId FROM employees WHERE lastname = ? AND firstname = ?;', emp.lastname, emp.firstname);
    err = await Database.Write('company.db', 'INSERT INTO accounts (employeeId, email, password) VALUES (?, ?, ?);', empMore[0].employeeId, emp.email, password);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.post('/job', async (req, res) => {
    const job = req.body;
    const err = await Database.Write('company.db', 'INSERT INTO jobs (name, jobDepartmentId, permissionLevel) VALUES (?, ?, ?);', job.jobName, parseInt(job.jobDepartmentId), job.permissionLevel);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true});
})

app.post('/isValidUser', async (req, res) => {
    const emp = req.body;
    let user = await Database.Read('company.db', 'SELECT jobs.permissionLevel FROM accounts LEFT JOIN employees ON employees.employeeId = accounts.employeeId LEFT JOIN jobs ON jobs.jobId = employees.jobId WHERE accounts.email = ? AND accounts.password = ?;', emp.email, hashPassword('sha256', 'base64', emp.password));
    if (user.length == 0) {
        res.json({exist: false});
        return;
    }
    res.json({permission: user[0].permissionLevel});
})

app.put('/updateEmployee', async (req, res) => {
    const emp = req.body;
    let err = await Database.Write('company.db', 'UPDATE employees SET lastname = ?, firstname = ?, jobId = ?, birthDate = ?, hireDate = ?, salary = ? WHERE employeeId = ?;', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary, emp.idEmployee);
    if (err != null) {
        res.json({status: false});
        return;
    }
    err = await Database.Write('company.db', 'UPDATE accounts SET email = ? WHERE employeeId = ?', emp.email, emp.idEmployee);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.put('/updateJob', async (req, res) => {
    const job = req.body;
    const err = await Database.Write('company.db', 'UPDATE jobs SET name = ?, jobDepartmentId = ?, permissionLevel = ? WHERE jobId = ?', job.updateName, job.updateJobDepartmentId, job.updatePerm,job.updateJobId);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.get('/employees', async (req, res) => {
    let employees = await Database.Read('company.db', 'SELECT employees.employeeId, employees.lastname, employees.firstname, accounts.email, employees.birthDate, employees.hireDate, jobs.name AS jobName, employees.salary, jobs.jobId FROM employees LEFT JOIN jobs ON jobs.jobId = employees.jobId LEFT JOIN accounts ON accounts.employeeId = employees.employeeId;');
    res.json(employees);
})

app.get('/jobs', async (req, res) => {
    let jobs = await Database.Read('company.db', 'SELECT jobs.jobId, jobs.name AS jobName, jobs.jobDepartmentId, jobsDepartments.name AS departmentName, jobs.permissionLevel FROM jobs LEFT JOIN jobsDepartments ON jobsDepartments.jobDepartmentId = jobs.jobDepartmentId;');
    res.json(jobs);
})

app.get('/jobsDepartments', async (req, res) => {
    let jobsDepartments = await Database.Read('company.db', 'SELECT * FROM jobsDepartments;');
    res.json(jobsDepartments);
})

app.listen(PORT, () => {
    console.log('Server started ! http://localhost:3001');
    console.log(`Server now listening on ${PORT}`);
})