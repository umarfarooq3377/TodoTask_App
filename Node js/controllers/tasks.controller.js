const Task = require('../models/tasks.model');

// Get all Tasks
async function httpGetAllTasks(req, res) {
  try {
    const tasks = await Task.find({}).sort({ taskNumber: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// create a new Task
async function httpCreateTask(req, res) {
  const { title, status, dueDate } = req.body;
  let emptyFields = [];
  if (!title) {
    emptyFields.push('title');
  }
  if (!status) {
    emptyFields.push('status');
  }
  if (!dueDate) {
    emptyFields.push('dueDate');
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: 'Please fill all in the fields', emptyFields });
  }

  try {
    // Add document to DB
    const task = await Task.create({ title, status, dueDate });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Update a task
async function httpUpdateTask(req, res) {
  const { id } = req.params;
  try {
    // Find and updating
    const task = await Task.findOneAndUpdate(
      { taskNumber: Number(id) },
      {
        ...req.body,
      }
    );

    if (!task) {
      return res.status(404).json({ error: 'No such task for updating' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Delete a Task
async function httpDeleteTask(req, res) {
  const { id } = req.params;
  try {
    // finding task
    const task = await Task.findOneAndDelete({
      taskNumber: Number(id),
    });

    if (!task) {
      return res.status(404).json({ error: 'No such task for deleting' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  httpGetAllTasks,
  httpCreateTask,
  httpDeleteTask,
  httpUpdateTask,
};
