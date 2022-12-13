import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingButton from '@mui/lab/LoadingButton';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { toast } from 'react-toastify';
import { fetchTasks, selectAllTasks } from '../features/tasks/tasksSlice';
import { createTask, updateTask } from '../Api/tasksApi';
import {
  Autocomplete,
  Container,
  Box,
  Paper,
  TextField,
  Typography,
  Stack,
} from '@mui/material';

const TodoForm = ({ update, editTaskNumber, setModalShow }) => {
  const [loading, setLoading] = useState(false);
  const [taskStatus, setTaskStatus] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date(Date.now()));
  const [taskData, setTaskData] = useState([]);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorStatus, setErrorStatus] = useState(false);
  const tasks = useSelector(selectAllTasks);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Complete', value: 'complete' },
  ];

  const handleSubmit = useCallback(async () => {
    if (taskTitle === '' || taskStatus === '') {
      taskTitle === '' ? setErrorTitle(true) : setErrorTitle(false);
      taskStatus === '' ? setErrorStatus(true) : setErrorStatus(false);
    } else {
      setLoading(true);
      try {
        const data = await createTask({
          title: taskTitle,
          status: taskStatus,
          dueDate: taskDueDate,
        });
        if (data.status === 200) {
          navigate('/tasks');
          setTaskData(data);
          setLoading(false);
          setTaskTitle('');
          setTaskStatus('');
          setErrorTitle(false);
          setErrorStatus(false);
          dispatch(fetchTasks());
          toast.success('Created new Task ');
        } else {
          setLoading(false);
          throw new Error();
        }
      } catch (error) {
        toast.error('Opps! not created');
      }
    }
  }, [dispatch, navigate, taskDueDate, taskTitle, taskStatus]);

  const handleUpdate = useCallback(async () => {
    if (taskTitle === '' || taskStatus === '') {
      taskTitle === '' ? setErrorTitle(true) : setErrorTitle(false);
      taskStatus === '' ? setErrorStatus(true) : setErrorStatus(false);
    } else {
      setLoading(true);
      try {
        const data = await updateTask(
          {
            title: taskTitle,
            status: taskStatus,
            dueDate: taskDueDate,
          },
          editTaskNumber
        );
        if (data.status === 200) {
          setTaskData(data);
          setLoading(false);
          setModalShow(false);
          setTaskTitle('');
          setTaskStatus('');
          setErrorTitle(false);
          setErrorStatus(false);
          dispatch(fetchTasks());
          toast.success(`Updated Task # ${editTaskNumber}`);
        } else {
          setLoading(false);
          throw new Error();
        }
      } catch (error) {
        toast.error('Opps! not updated');
      }
    }
  }, [
    setModalShow,
    editTaskNumber,
    dispatch,
    taskDueDate,
    taskTitle,
    taskStatus,
  ]);

  const handlerStatuses = (obj) => {
    setTaskStatus(obj.value);
    if (obj.value !== '') {
      setErrorStatus(false);
    }
  };
  const handleDueDate = (e) => {
    setTaskDueDate(e?._d);
  };

  const handlerTaskTitle = (e) => {
    const { value } = e.target;
    setTaskTitle(value);
    if (value !== '') {
      setErrorTitle(false);
    }
  };

  useEffect(() => {
    if (update === 'update') {
      const [editTask] = tasks.filter(
        (task) => task.taskNumber === editTaskNumber
      );
      setTaskTitle(editTask.title);
      setTaskStatus(editTask.status);
      setTaskDueDate(editTask.dueDate);
    }
  }, [editTaskNumber, tasks, update]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Container>
          <Box
            sx={{
              display: 'flex',
              mt: '2rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              '& > :not(style)': {
                width: 450,
                height: 450,
              },
            }}
          >
            <Paper elevation={10} sx={{ p: '2rem' }}>
              <Typography
                sx={{ mb: '1.5rem', textAlign: 'center' }}
                variant="h4"
              >
                {update === 'update' ? 'Update Task' : 'Create Task'}
              </Typography>
              <Box
                component="form"
                sx={{
                  '& .MuiTextField-root': { m: 0, mb: 3 },
                  display: 'flex',
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  disabled={loading}
                  color="secondary"
                  error={errorTitle ? true : false}
                  fullWidth
                  label={errorTitle ? 'Required*' : 'Enter Title'}
                  variant="outlined"
                  value={taskTitle}
                  onChange={handlerTaskTitle}
                />
              </Box>
              <Autocomplete
                disablePortal
                disabled={loading}
                options={statusOptions}
                value={taskStatus}
                onChange={(_e, e) =>
                  e ? handlerStatuses(e) : setTaskStatus('')
                }
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    fullWidth
                    {...params}
                    sx={{ mb: 3 }}
                    error={errorStatus ? true : false}
                    label={errorStatus ? 'Required*' : 'Select Status'}
                  />
                )}
              />
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <Stack spacing={3}>
                  <DesktopDatePicker
                    label="Due Date"
                    inputFormat="MM/DD/YYYY"
                    value={taskDueDate}
                    disabled={loading}
                    onChange={handleDueDate}
                    disablePast={taskStatus === 'complete' ? false : true}
                    disableFuture={taskStatus === 'pending' ? false : true}
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        error={errorStatus ? true : false}
                        label={errorStatus ? 'Required*' : 'Due Date'}
                        {...params}
                      />
                    )}
                  />
                </Stack>
              </LocalizationProvider>
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <LoadingButton
                  color="secondary"
                  sx={{ pr: 5 }}
                  size="large"
                  onClick={update === 'update' ? handleUpdate : handleSubmit}
                  loading={loading}
                  variant="contained"
                >
                  {update === 'update' ? 'Update Task' : 'Submit Task'}
                </LoadingButton>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default TodoForm;
