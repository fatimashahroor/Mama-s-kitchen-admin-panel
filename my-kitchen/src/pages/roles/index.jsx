import React, { useState, useEffect } from 'react';
import { List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import {authLocal} from '../login/auth-local';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../../components/NavigationBar';
import DeleteModal from '../../components/DeleteModal';
import "./styles.css";

const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState({ id: null, name: '' , permissions: '' });
    const [modalData, setModalData] = useState({ id: null, name: '', permissions: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [ShowDeleteModal, setShowDeleteModal] = useState(null);
  
    const fetchRoles = async () => {
        try {
            const token = authLocal.getToken();
            const response = await fetch('http://192.168.1.11:4000/api/role', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data.data);
            if (response.ok) {
                setRoles(data.data);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.toString());
        }
    };

    const handleDelete = async (roleId) => {
        try {
            const token = authLocal.getToken();
            const response = await fetch(`http://192.168.1.11:4000/api/role/delete/${roleId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                fetchRoles();
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError(error.toString());
        }
    };
    useEffect(() => {
        fetchRoles();
    }, []);

    const createRole = async () => {
        try {
            const token = authLocal.getToken();
            const response = await fetch('http://192.168.1.11:4000/api/role/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: modalData.name, permissions: modalData.permissions }),
            });
            console.log(modalData);
            if (response.ok) {           
                fetchRoles();
                setModalData({ id: null, name: '', permissions: '' });
                handleClose();
            } else {
                const data = await response.json();
                setError(data.message);
            }
        } catch (error) {
            setError(error.toString());
        }
    }
    const updateRole = (role) => {
        setEditData({ id: role.id, name: role.name, permissions: role.permissions });
        setModalOpen(true);
        try {
            const token = authLocal.getToken();
            const response = fetch(`http://192.168.1.11:4000/api/role/update/${role.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name: role.name, permissions: role.permissions }),
            });
            if (response.ok) {
                fetchRoles();
                handleClose();
            }
        } catch (error) {
            setError(error.toString());
        }
    }
    const handleEditClick = (role) => {
        setError(null);
        const permissionNames = role.permissions.map(permission => permission.name).join(', ');
        setEditData({ id: role.id, name: role.name, permissions: permissionNames });
        setModalOpen(true);

    };
    const handleCreateClick = () => {
        setError(null);
        setModalData({ id: null, name: '', permissions: '' });
        setModalAddOpen(true);

    };
    const handleClose = () => {
        setModalOpen(false);
        setModalAddOpen(false);
        setEditData({ id: null, name: '', permissions: '' });
    };
    return (
        <div className="container">
            <Navbar />
            <div className='title'>
                <h2>Roles</h2>
                <button className='add' onClick={handleCreateClick}> Add Role</button>
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <List style={{ width: '80%', padding: 50, marginTop: -30, marginLeft: -10 }}>
            <ListItem style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <div className='header' style={{ flex: 3, fontWeight: 'bold', textAlign: 'left' }}>Role</div>
            <div className='header' style={{ flex: 1.5, fontWeight: 'bold', textAlign: 'left', marginRight: 340, marginLeft: -20}}>Permission</div>
            <div className='header'></div>
                </ListItem>
                {roles.map((role) => (
                    <ListItem key={role.id} className="list-item">
                        <div style={{ flex: 1.5 }}>{role.name}</div>
                        <div className='permission-container' style={{ flex: 10 }}>
                            {role.permissions.map((permission) => (
                                <div className='permission' key={permission.id}>
                                    {permission.name}
                                </div>
                            ))}
                        </div>
                        <div>
                        <div aria-label="edit" style={{ marginRight: 10 }} onClick={() => handleEditClick(role)}>
                        <EditIcon style={{ cursor: 'pointer'}}/>
                        </div>
                        </div>
                        <div onClick={() => setShowDeleteModal(role.id)} aria-label="delete">
                            <DeleteIcon style={{ cursor: 'pointer', marginLeft: 15}}/>
                        </div>
                        <DeleteModal
                            deleteFunction={() => handleDelete(role.id)}
                            objectName="role"
                            showModal={ShowDeleteModal === role.id}
                            onClose={() => setShowDeleteModal(null)}
                        />
                    </ListItem>
                ))}
                <Dialog open={modalOpen} onClose={handleClose}>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus margin="dense" label="Role Name" type="text" fullWidth                           
                        value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#B20530',                       }
                            },
                            '& .MuiInputLabel-root': {
                                color: 'grey',
                                '&.Mui-focused': {
                                    color: 'grey', 
                                }
                            }
                        }}
                        />
                        <TextField
                            autoFocus margin="dense" label="Permissions" type="text" fullWidth
                            value={editData.permissions} onChange={(e) => setEditData({ ...editData, permissions: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#B20530',                       }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'grey',
                                    '&.Mui-focused': {
                                        color: 'grey', 
                                    }
                                }
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className='delete' onClick={handleClose}>Cancel</button>
                        <button className='delete' onClick={() => updateRole(editData)}>Confirm</button>
                    </DialogActions>
                </Dialog>
                <Dialog open={modalAddOpen} onClose={handleClose}>
                    <DialogTitle>Add Role</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus margin="dense" label="Role Name" type="text" fullWidth
                            value={modalData.name} onChange={(e) => setModalData({ ...modalData, name: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#B20530',                       }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'grey',
                                    '&.Mui-focused': {
                                        color: 'grey', 
                                    }
                                }
                            }}
                        />
                        <TextField
                            autoFocus margin="dense" label="Permissions" type="text" fullWidth
                            value={modalData.permissions} onChange={(e) => setModalData({ ...modalData, permissions: e.target.value })}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#B20530',                       }
                                },
                                '& .MuiInputLabel-root': {
                                    color: 'grey',
                                    '&.Mui-focused': {
                                        color: 'grey', 
                                    }
                                }
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <button className='delete' onClick={handleClose}>Cancel</button>
                        <button className='delete' onClick={() => {createRole(); handleClose()}}>Confirm</button>
                    </DialogActions>
                </Dialog>
            </List>
        </div>
    );
}


export default Roles;