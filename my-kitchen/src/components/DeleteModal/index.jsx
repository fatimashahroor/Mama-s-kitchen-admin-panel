import React from 'react';
import './styles.css';
import {Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';


const DeleteModal = ({ deleteFunction, objectName, showModal, onClose }) => {
  const handleDelete = () => {
    deleteFunction();
    onClose(); 
  };
  
  if (!showModal) return null;

  return (
      <Dialog open={showModal} onClose={onClose}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this {objectName}? This action cannot be undone.</p>
        </DialogContent>
        <DialogActions>
        <DialogActions>
          
          <button className = 'delete' onClick={onClose}>Cancel</button>
          <button className = 'delete' onClick={handleDelete}>Confirm</button>
        </DialogActions>
        </DialogActions>
      </Dialog>
  );
};

export default DeleteModal;