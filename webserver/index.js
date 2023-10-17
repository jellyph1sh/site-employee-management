const express = require('express');

const PORT = 3001

const app = express();

app.get("/", (req, res) => {
    res.json({ message: "Hello from server!" });
});

app.listen(PORT, () => {
    console.log('Server started ! http://localhost:3001');
    console.log(`Server now listening on ${PORT}`);
})