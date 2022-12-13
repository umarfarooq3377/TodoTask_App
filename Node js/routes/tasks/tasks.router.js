const express = require('express');
const tasksRoutes = express.Router();

const {
  httpGetAllTasks,
  httpCreateTask,
  httpDeleteTask,
  httpUpdateTask,
} = require('../../controllers/tasks.controller');

//  Get all tasks
tasksRoutes.get('/', httpGetAllTasks);

// Post a new task
tasksRoutes.post('/', httpCreateTask);

// Delete a task
tasksRoutes.delete('/:id', httpDeleteTask);

// Update a task
tasksRoutes.patch('/:id', httpUpdateTask);

module.exports = tasksRoutes;
