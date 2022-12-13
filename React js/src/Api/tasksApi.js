import axios from 'axios';
const URL_API = 'http://localhost:4000/';

async function createTask(obj) {
  let response;
  try {
    response = await axios.post(`${URL_API}tasks`, obj);
  } catch (error) {
    response = error;
  }
  return response;
}

async function updateTask(obj, taskNumber) {
  let response;
  try {
    response = await axios.patch(`${URL_API}tasks/${taskNumber}`, obj);
  } catch (error) {
    response = error;
  }
  return response;
}

async function deleteTask(taskNumber) {
  let response;
  try {
    response = await axios.delete(`${URL_API}tasks/${taskNumber}`);
  } catch (error) {
    response = error;
  }
  return response;
}

export { createTask, updateTask, deleteTask };
