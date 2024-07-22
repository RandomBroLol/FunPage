const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

const logFilePath = path.join(__dirname, 'logs.txt');

app.post('/log-ip', (req, res) => {
    const ip = req.body.ip;
    if (ip) {
        fs.appendFile(logFilePath, `${ip}\n`, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
                return res.status(500).send('Internal Server Error');
            }
            res.status(200).send('IP Address Logged');
        });
    } else {
        res.status(400).send('Bad Request');
    }
});

app.get('/logs', (req, res) => {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading log file:', err);
            return res.status(500).send('Internal Server Error');
        }
        res.send(`<pre>${data}</pre>`);
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
