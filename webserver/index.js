const express = require('express');
const Database = require('./Database');
const cors = require('cors')

const PORT = 3001

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
    const err = await Database.Write('company.db', 'INSERT INTO Employees (name, firstName, jobId, birthDate, hireDate, salary, mail) VALUES (?, ?, ?, ?, ?, ?, ?);', emp.lastname, emp.firstname, emp.jobId, emp.birthdate, emp.hiredate, emp.salary, emp.email);
    if (err != null) {
        res.json({status: false});
        return;
    }
    res.json({status: true})
})

app.post('isValidUser', async (req, res) => {
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

app.get('/employees', async (req, res) => {
    let employees = await Database.Read('company.db', 'SELECT Employees.employeeId, Employees.name, Employees.firstName, Employees.mail, Employees.birthDate, Employees.hireDate, Jobs.name AS jobName, Employees.salary,Jobs.jobId FROM Employees LEFT JOIN Jobs ON Jobs.jobId = Employees.jobId;');
    res.json(employees);
})

app.get('/jobs', async (req, res) => {
    let jobs = await Database.Read('company.db', 'SELECT jobId, name AS jobName FROM jobs;');
    res.json(jobs);
})

app.listen(PORT, () => {
    console.log('Server started ! http://localhost:3001');
    console.log(`Server now listening on ${PORT}`);
})