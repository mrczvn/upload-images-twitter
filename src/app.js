const express = require('express');
const router = require('./routes');
const httpErrors = require('./middlewares/http-errors');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
app.use(httpErrors.developmentErrors);

module.exports = app;
