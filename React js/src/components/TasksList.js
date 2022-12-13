import { Typography, Box } from '@mui/material';
import React from 'react';
import TableData from './TableData';

const TasksList = () => {
  return (
    <>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4">Listed Tasks</Typography>
      </Box>
      <TableData />
    </>
  );
};

export default TasksList;
