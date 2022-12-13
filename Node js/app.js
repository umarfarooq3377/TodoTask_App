const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const tasksRoutes = require('./routes/tasks/tasks.router');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/tasks', tasksRoutes);

module.exports = app;
