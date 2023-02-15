const express = require('express');
const logger = require('morgan');
require('dotenv').config();
const indexRouter = require('./routes/index');
const settingsRouter = require('./routes/settings');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/trigger', indexRouter);
app.use('/api/settings', settingsRouter);

app.listen(3000, () => console.log("application started"))

module.exports = app;
