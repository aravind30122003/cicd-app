// Simple Node.js app
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from CI/CD! Created by Aravind');
});

app.get('/healthz', (req, res) => res.status(200).send('ok'));
app.get('/ready', (req, res) => res.status(200).send('ready'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App listening on ${port}`);
});
