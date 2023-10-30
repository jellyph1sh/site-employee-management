const Database = require('./Database');
const generatePasswd = require('generate-password');
const crypto = require('crypto');

const DBPATH = './company.db';

/*------------------------------------*/
/*--------------SECURITY--------------*/
/*------------------------------------*/
const generatePassword = (charLen) => {
    return generatePasswd.generate({ 
        length: charLen, 
        numbers: true
    })
}

const hashPassword = (algorithm, base, passwd) => {
    return crypto.createHash(algorithm).update(passwd).digest(base);
}

/*------------------------------------*/
/*----------------JOBS----------------*/
/*------------------------------------*/
exports.getJobs = async (req, res) => {
    let jobs = await Database.Read(DBPATH, 'SELECT jobs.jobId, jobs.name AS jobName, jobs.jobDepartmentId, jobsDepartments.name AS departmentName, jobs.permissionLevel FROM jobs LEFT JOIN jobsDepartments ON jobsDepartments.jobDepartmentId = jobs.jobDepartmentId;');
    res.json(jobs);
}

exports.addJob = async (req, res) => {
    const job = req.body;
    const err = await Database.Write(DBPATH, 'INSERT INTO jobs (name, jobDepartmentId, permissionLevel) VALUES (?, ?, ?);', job.jobName, parseInt(job.jobDepartmentId), job.permissionLevel);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    res.json({status: true});
}

exports.updateJob = async (req, res) => {
    const job = req.body;
    const err = await Database.Write(DBPATH, 'UPDATE jobs SET name = ?, jobDepartmentId = ?, permissionLevel = ? WHERE jobId = ?', job.updateName, job.updateJobDepartmentId, job.updatePerm,job.updateJobId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    res.json({status: true})
}

exports.deleteJob = async (req, res) => {
    const job = req.body;
    let err = await Database.Write(DBPATH, 'DELETE FROM superiors WHERE superiors.jobId = ? OR superiors.superiorId = ?;', job.jobId, job.jobId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    err = await Database.Write(DBPATH, 'DELETE FROM accounts WHERE EXISTS (SELECT * FROM employees WHERE employees.employeeId = accounts.employeeId AND employees.jobId = ?)', job.jobId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    err = await Database.Write(DBPATH, 'DELETE FROM employees WHERE employees.jobId = ?;', job.jobId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    err = await Database.Write(DBPATH, 'DELETE FROM jobs WHERE jobs.jobId = ?;', job.jobId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    res.json({status: true});
}

/*------------------------------------*/
/*-------------DEPARTMENTS------------*/
/*------------------------------------*/
exports.getDepartments = async (req, res) => {
    let jobsDepartments = await Database.Read(DBPATH, 'SELECT * FROM jobsDepartments;');
    res.json(jobsDepartments);
}

/*------------------------------------*/
/*--------------EMPLOYEES-------------*/
/*------------------------------------*/
exports.getEmployees = async (req, res) => {
    let employees = await Database.Read(DBPATH, 'SELECT employees.employeeId, employees.lastname, employees.firstname, accounts.email, employees.birthDate, employees.hireDate, jobs.name AS jobName, employees.salary, jobs.jobId FROM employees LEFT JOIN jobs ON jobs.jobId = employees.jobId LEFT JOIN accounts ON accounts.employeeId = employees.employeeId;');
    res.json(employees);
}

exports.addEmployee = async (req, res) => {
    const emp = req.body;
    let err = await Database.Write(DBPATH, 'INSERT INTO employees (lastname, firstname, jobId, birthDate, hireDate, salary) VALUES (?, ?, ?, ?, ?, ?);', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    const password = hashPassword('sha256', 'base64', generatePassword(16))
    const empMore = await Database.Read(DBPATH, 'SELECT employeeId FROM employees WHERE lastname = ? AND firstname = ?;', emp.lastname, emp.firstname);
    err = await Database.Write(DBPATH, 'INSERT INTO accounts (employeeId, email, password) VALUES (?, ?, ?);', empMore[0].employeeId, emp.email, password);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    res.json({status: true})
}

exports.updateEmployee = async (req, res) => {
    const emp = req.body;
    let err = await Database.Write(DBPATH, 'UPDATE employees SET lastname = ?, firstname = ?, jobId = ?, birthDate = ?, hireDate = ?, salary = ? WHERE employeeId = ?;', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary, emp.idEmployee);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    err = await Database.Write(DBPATH, 'UPDATE accounts SET email = ? WHERE employeeId = ?', emp.email, emp.idEmployee);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    res.json({status: true})
}

exports.deleteEmployee = async (req, res) => {
    const emp = req.body;
    let err = await Database.Write(DBPATH, 'DELETE FROM accounts WHERE accounts.employeeId = ?;', emp.employeeId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    err = await Database.Write(DBPATH, ' DELETE FROM employees WHERE employees.employeeId = ?;', emp.employeeId);
    if (err != null) {
        console.error(err);
        res.json({status: false});
        return;
    }
    res.json({status: true});
}

/*------------------------------------*/
/*--------------ACCOUNTS--------------*/
/*------------------------------------*/
exports.isValidAccount = async (req, res) => {
    const emp = req.body;
    let user = await Database.Read(DBPATH, 'SELECT jobs.permissionLevel FROM accounts LEFT JOIN employees ON employees.employeeId = accounts.employeeId LEFT JOIN jobs ON jobs.jobId = employees.jobId WHERE accounts.email = ? AND accounts.password = ?;', emp.email, hashPassword('sha256', 'base64', emp.password));
    if (user.length == 0) {
        console.error(err);
        res.json({exist: false});
        return;
    }
    res.json({permission: user[0].permissionLevel});
}