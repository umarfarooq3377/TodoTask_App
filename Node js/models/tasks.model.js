const mongoose = require('mongoose');
autoIncrement = require('mongoose-auto-increment');

const connection = mongoose.createConnection(process.env.MONGO_URL);
autoIncrement.initialize(connection);
const tasksSchema = new mongoose.Schema(
  {
    taskNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
      lowercase: true,
    },
    status: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

tasksSchema.plugin(autoIncrement.plugin, {
  model: 'task',
  field: 'taskNumber',
  startAt: 500,
  incrementBy: 1,
});

module.exports = mongoose.model('task', tasksSchema);
