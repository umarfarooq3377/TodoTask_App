import React from 'react';
import { Backdrop, Box, Modal, Fade } from '@mui/material/';
import TodoForm from './TodoForm';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 0,
};

export default function ModalForm({ modalShow, setModalShow, editTaskNumber }) {
  const handleClose = () => setModalShow(false);
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={modalShow}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalShow}>
          <Box sx={style}>
            <TodoForm
              update={'update'}
              editTaskNumber={editTaskNumber}
              setModalShow={setModalShow}
            />
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
