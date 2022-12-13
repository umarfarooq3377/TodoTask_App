import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableSortLabel,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  Paper,
  Checkbox,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { visuallyHidden } from '@mui/utils';
import moment from 'moment';
import { toast } from 'react-toastify';
import ModalForm from './ModalForm';
import Loader from './Loader';
import {
  selectAllTasks,
  getTasksStatus,
  getTasksError,
  fetchTasks,
} from '../features/tasks/tasksSlice';
const { deleteTask } = require('../Api/tasksApi');

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: 'taskNumber',
    numeric: true,
    disablePadding: true,
    label: 'Task #',
  },
  {
    id: 'taskName',
    numeric: false,
    disablePadding: false,
    label: 'Task Name',
  },
  {
    id: 'taskstatus',
    numeric: false,
    disablePadding: false,
    label: 'Status',
  },
  {
    id: 'taskDueDate',
    numeric: false,
    disablePadding: false,
    label: ' Due Date',
  },
  {
    id: 'editButton',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
  {
    id: 'deleteButton',
    numeric: false,
    disablePadding: false,
    label: 'Action',
  },
];

function EnhancedTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow sx={{ backgroundColor: '#9c27b0' }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="secondary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all desserts',
            }}
          />
        </TableCell>
        {headCells?.map((headCell, index) => (
          <TableCell
            key={index}
            sx={{ color: '#fff', fontWeight: 'bold' }}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.taskNumber ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.taskNumber}
              direction={orderBy === headCell.taskNumber ? order : 'asc'}
              onClick={createSortHandler(headCell.taskNumber)}
            >
              {headCell.label}
              {orderBy === headCell.taskNumber ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h5"
          id="tableTitle"
          component="div"
        >
          User Tasks
        </Typography>
      )}
    </Toolbar>
  );
}

const TableData = () => {
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('ordersNumber');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(4);
  const [modalShow, setModalShow] = useState(false);
  const [editTaskNumber, setEditTaskNumber] = useState(0);
  const tasks = useSelector(selectAllTasks);
  const taskStatus = useSelector(getTasksStatus);
  const error = useSelector(getTasksError);
  const dispatch = useDispatch();

  useEffect(() => {
    if (taskStatus === 'idle') {
      dispatch(fetchTasks());
    }
  }, [taskStatus, dispatch]);

  const handlerEdit = (taskNumber) => {
    setModalShow(true);
    setEditTaskNumber(taskNumber);
  };

  const handlerDelete = useCallback(
    async (task_id) => {
      try {
        setLoading(true);
        const data = await deleteTask(task_id);
        if (data.status === 200) {
          dispatch(fetchTasks());
          setLoading(false);
          toast.success(`Deleted Task # ${task_id}`);
        } else {
          throw new Error();
        }
      } catch (error) {
        setLoading(false);
        toast.error('Opps! not Delete');
      }
    },
    [dispatch]
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    // setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = tasks?.map((n) => n.taskNumber);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tasks.length) : 0;

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Box sx={{ width: '70%' }}>
          <Paper sx={{ width: '100%', mb: 2 }} elevation={3}>
            <EnhancedTableToolbar numSelected={selected.length} />
            <TableContainer>
              {taskStatus === 'loading' ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Loader />
                </Box>
              ) : taskStatus === 'succeeded' ? (
                <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
                  <EnhancedTableHead
                    numSelected={selected?.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={tasks?.length}
                  />
                  <TableBody>
                    {stableSort(tasks, getComparator(order, orderBy))
                      ?.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      ?.map((row, index) => {
                        const isItemSelected = isSelected(row.taskNumber);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            // onClick={(event) => handleClick(event, row.orderNumber)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={index}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) =>
                                  handleClick(event, row.taskNumber)
                                }
                                color="secondary"
                                checked={isItemSelected}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.taskNumber}
                            </TableCell>
                            <TableCell align="left">{row.title}</TableCell>
                            <TableCell
                              align="left"
                              sx={{
                                color:
                                  row.status === 'delayed'
                                    ? 'red'
                                    : row.status === 'complete'
                                    ? 'green'
                                    : null,
                              }}
                            >
                              {row.status}
                            </TableCell>
                            <TableCell align="left">
                              {moment(row.dueDate).format('ddd, MMM Do YYYY')}
                            </TableCell>
                            <TableCell align="right">
                              <Box sx={{ textAlign: 'left' }}>
                                <LoadingButton
                                  color="secondary"
                                  sx={{ pr: loading ? '33px' : '10px' }}
                                  size="small"
                                  onClick={() => handlerEdit(row.taskNumber)}
                                  loading={loading}
                                  variant="contained"
                                >
                                  Edit
                                </LoadingButton>
                              </Box>
                            </TableCell>
                            <TableCell align="left">
                              <Box sx={{ textAlign: 'left' }}>
                                <LoadingButton
                                  sx={{
                                    backgroundColor: '#e43225',
                                    pr: loading ? '33px' : '10px',
                                  }}
                                  className="delete-hover"
                                  size="small"
                                  onClick={() => handlerDelete(row.taskNumber)}
                                  loading={loading}
                                  variant="contained"
                                >
                                  Delete
                                </LoadingButton>
                              </Box>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: 53 * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Typography
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    color: '#c01c1c ',
                  }}
                >
                  {error}
                </Typography>
              )}
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tasks?.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Paper>
        </Box>
        <ModalForm
          modalShow={modalShow}
          setModalShow={setModalShow}
          editTaskNumber={editTaskNumber}
        />
      </Box>
    </>
  );
};

export default TableData;
