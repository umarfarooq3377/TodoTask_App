const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const Agenda = require('agenda');
const Task = require('./models/tasks.model');
const moment = require('moment');

const PORT = process.env.PORT || 8626;
const server = http.createServer(app);

mongoose.set('strictQuery', true);

// Connect to db
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    // listen for Requests
    server.listen(PORT, () => {
      console.log(`Connected to Db & listening on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Cron Jobs
const lastWeekAgo = new Date(moment().subtract(7, 'days').startOf('day'));
const currentDate = new Date(moment().startOf('day'));
const agenda = new Agenda({ db: { address: process.env.MONGO_URL } });

agenda.define('delete all tasks older than seven', async () => {
  try {
    const deleteTasks = await Task.deleteMany({
      status: 'delayed',
      dueDate: { $lte: lastWeekAgo },
    });
    console.log(deleteTasks);
  } catch (error) {
    console.log(error); // Failure
  }
});

agenda.define('update the status of dueDate is past', async () => {
  try {
    const updateStatuses = await Task.updateMany(
      {
        dueDate: { $lte: currentDate },
      },
      { $set: { status: 'delayed' } }
    );
    console.log(updateStatuses);
  } catch (error) {
    console.log(error); // Failure
  }
});

(async function () {
  await agenda.start();
  //   0 0 * * * for Every Night
  await agenda.every('0 0 * * *', 'update the status of dueDate is past');
  await agenda.every('0 0 * * *', 'delete all tasks older than seven');
})();
