const express = require('express');
const cors = require('cors');
require("dotenv").config();
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
}));

app.get('/address/:address/*', routes.address);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running at port ${port}`)
});

module.exports = app;
