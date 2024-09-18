import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { authLocal } from '../../pages/login/auth-local';

const AddUserModal = ({ open, handleClose, roles }) => {
    const [newUserData, setNewUserData] = useState({
        fullName: '',
        email: '',
        password: '',
        roles: []
    });

    const handleChange = (event) => {
        setNewUserData({ ...newUserData, [event.target.name]: event.target.value });
    };

    const handleSubmit = async () => {
        const token = authLocal.getToken();
        const response = await fetch(`http://192.168.1.4:4000/api/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newUserData)
        });

        const data = await response.json();
        if (response.ok) {
            handleClose(); // Close the modal on success
            console.log('User added:', data);
        } else {
            console.error('Failed to add user:', data.message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add New User</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    name="fullName"
                    value={newUserData.fullName}
                    onChange={handleChange}
                />
                <TextField
                    margin="dense"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    name="email"
                    value={newUserData.email}
                    onChange={handleChange}
                />
                <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                        value={newUserData.role}
                        onChange={handleChange}
                        name="role"
                        label="Role"
                    >
                        {roles.map((role) => (
                            <MenuItem key={role.id} value={role.name}>{role.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={handleSubmit} color="primary" variant="contained" style={{ marginTop: 20 }}>
                    Submit
                </Button>
            </DialogContent>
        </Dialog>
    );
};

export default AddUserModal;