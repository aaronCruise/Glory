const express = require('express')
const db = require('./database')
const app = express()
const port = 8080
const bodyParser = require("body-parser");
const registerRoute = require('./controllers/registerationController');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/register', registerRoute);

app.use((req, res, next) => {
  console.log(`Received request on ${req.url} with body:`, req.body);
  next();
});

// GET
app.get('/tasks', async (req, res) => {
    try {
        const result = await db.pool.query("select * from tasks");
        res.send(result);
    } catch (err) {
        throw err;
    }
});

// POST
app.post('/tasks', async (req, res) => {
    let task = req.body;
    try {
        const result = await db.pool.query("insert into tasks (description) values (?)", [task.description]);
        res.send(result);
    } catch (err) {
        throw err;
    }
});

app.put('/tasks', async (req, res) => {
    let task = req.body;
    try {
        const result = await db.pool.query("update tasks set description = ?, completed = ? where id = ?", [task.description, task.completed, task.id]);
        res.send(result);
    } catch (err) {
        throw err;
    }
});

app.delete('/tasks', async (req, res) => {
    let id = req.query.id;
    try {
        const result = await db.pool.query("delete from tasks where id = ?", [id]);
        res.send(result);
    } catch (err) {
        throw err;
    }
});

app.listen(port, () => console.log(`Listening on port ${port}`));
