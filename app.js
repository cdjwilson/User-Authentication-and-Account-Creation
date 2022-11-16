const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const bcrypt = require('bcrypt');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nodelogin'
});

connection.connect((err) => {
    if (err) return console.log('Error');
    console.log("Connected to Database!");
});

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/login.html'));
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.send(`Welcome, ${req.session.username}!`);
    } else {
        res.redirect('/');
    }
    res.end();
});

app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname + '/create.html'));
});

app.get('/usercheck', (req, res) => {
    connection.query('SELECT * FROM accounts WHERE username = ?', [req.query.username], (error, results, fields) => {
        if (error) console.log("Error");
        var message;
        if (results.length > 0) {
            message = 'user exists';
        } else {
            message = "user doesn't exist";
        }
        res.json({message:message});
    });
});

app.get('/emailcheck', (req, res) => {
    connection.query('SELECT * FROM accounts WHERE email = ?', [req.query.email], (error, results, fields) => {
        if (error) console.log("Error");
        var message;
        if (results.length > 0) {
            message = 'email exists';
        } else {
            message = "email doesn't exist";
        }
        res.json({message:message});
    });
});

app.post('/auth', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username && password) {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results, fields) => {
            if (error) return console.log('Error');
            
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, result) => {
                    if (result) {
                        req.session.loggedin = true;
                        req.session.username = username;
                        res.redirect('/home');
                        res.end();
                    } else {
                        res.send('Incorrect Username and/or Password!');
                        res.end();
                    }
                });
            } else {
                res.send('Incorrect Username and/or Password!');
                res.end();
            }
        });
    } else {
        res.send('Please ender a Username and Password');
        res.end();
    }
});

app.post('/create', (req, res) => {
    let username = req.body.username;
    if (username) {
        connection.query('SELECT * FROM accounts WHERE username = ?', [username], (error, results, fields) => {
            if (error) return console.log("Error");
            
            if (results.length > 0) {
                res.send('Username Already Exists');
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) return console.log("Error");
                    connection.query('INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)', [req.body.username, hash, req.body.email], (error, results) => {
                        res.send('Account Created');
                    });
                });
            }
        });
    }
    res.end();
});


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));