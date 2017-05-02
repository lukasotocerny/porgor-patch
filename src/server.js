const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, '..', 'build')));

app.get('/', function (req, res) {
  console.log(__dirname);
  res.sendFile(path.join(__dirname, '..', 'build', 'index.html'));
});

app.get('/login', function (req, res) {
  console.log(req.text);
})

app.listen(PORT);