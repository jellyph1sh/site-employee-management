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

app.post('/test', (req, res) => {
    console.log(req.body);
    res.send("POST Request Called")
})

app.put('/put', (req, res) => {
    console.log(req.body);
    res.send("PUT Request Called")
})

app.get('/employees', async (req, res) => {
    let employees = await Database.Read('company.db', 'SELECT * FROM Employees;');
    res.json(employees);
})

app.listen(PORT, () => {
    console.log('Server started ! http://localhost:3001');
    console.log(`Server now listening on ${PORT}`);
})