import React, { useState, useEffect } from 'react';
import { List, ListItem, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import {authLocal} from '../login/auth-local';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Navbar from '../../components/NavigationBar';
import DeleteModal from '../../components/DeleteModal';
import "./styles.css";

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [editData, setEditData] = useState({ id: null, phone: '', bio: '', age: '', status: '', located_in: '' });
    const [modalData, setModalData] = useState({ id: null, full_name: '', email: '', password: '', roles: '' });
    const [modalOpen, setModalOpen] = useState(false);
    const [modalAddOpen, setModalAddOpen] = useState(false);
    const [ShowDeleteModal, setShowDeleteModal] = useState(null);
    const fetchUsers = async () => {
        setError(null);
        try {
            const token = authLocal.getToken();
            const response = await fetch('http://192.168.1.11:4000/api/user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setUsers(data.data);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.toString());
            console.error(error);
        }
    };

    const handleDelete = async (userId) => {
        setError(null);
        try {
            const token = authLocal.getToken();
            const response = await fetch(`http://192.168.1.11:4000/api/user/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
            if (response.ok) {
                fetchUsers();
            }
        } catch (error) {
            setError(error.toString());
            console.error(error);
        }
        console.log('Delete user with ID:', userId);
    };
    const handleEditClick = (user) => {
        setError(null);
        setEditData({ id: user.id, phone: user.phone, bio: user.bio, age: user.age, status: user.status, located_in: user.located_in });
        setModalOpen(true);

    };
    const handleCreateClick = () => {
        setError(null);
        setModalData({ id: null, full_name: '', email: '', password: '', roles: '' });
        setModalAddOpen(true);

    };
    const handleClose = () => {
        setModalOpen(false);
        setModalAddOpen(false);
        setEditData({ id: null, phone: '', bio: '', age: '', status: '', located_in: '' });
    };
    const createUser =  async () => {
        const roles = [];
        roles[0] = parseInt(modalData.roles);
        console.log(roles);
        try {
            const token = authLocal.getToken();
            const response = await fetch(`http://192.168.1.11:4000/api/user/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    "full_name": modalData.full_name,
                    "email": modalData.email,
                    "password": modalData.password,
                    "roles": roles
                }),
            });
            const data = await response.json();
            if (response.ok) {
                fetchUsers();
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.toString());
            console.error(error);
        }
    };

    const updateUser =  async (userId) => {
        try {
            const token = authLocal.getToken();
            const response = await fetch(`http://192.168.1.11:4000/api/user/update/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ 
                    "phone": editData.phone,
                    "bio": editData.bio,
                    "age": editData.age,
                    "status": editData.status,
                    "located_in" : editData.located_in,
                }),
            });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                fetchUsers();
                setEditData(null);
            } else {
                setError(data.message);
            }
        } catch (error) {
            setError(error.toString());
            console.error(error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className='container'>
            <Navbar/>
            <div className='title'>
                <h2>Users</h2>
                <button className='addUser' onClick={handleCreateClick}> Add User</button>
            </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <List style={{ width: '80%', padding: 50, margin: '0 auto', marginTop: -40, marginLeft: -10 }}>
        <ListItem style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
          <div className='header' style={{ flex: 3, fontWeight: 'bold', textAlign: 'left' }}>Name</div>
          <div className='header' style={{ flex: 0.2, fontWeight: 'bold', textAlign: 'left', marginRight: 340, marginLeft: -20}}>Email</div>
          <div className='header' style={{ flex: 5.1, fontWeight: 'bold', textAlign: 'left', marginLeft: -80 }}>Role</div>
        </ListItem>
        {users.map(user => (
          <ListItem key={user.id} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
            <div style={{ flex: 3, fontSize: 19, textAlign: 'left' }}>{user.user.full_name}</div>
            <div style={{ flex: 3, fontSize: 19, textAlign: 'left', marginRight: 50 }}>{user.user.email}</div>
            <div style={{ flex: 1, fontSize: 19, textAlign: 'left' }}>{user.role}</div>
            <div style={{ flex: 4.2, textAlign: 'right' }}>
            <div aria-label="edit" style={{ marginRight: 200 }} onClick={() => handleEditClick(user.user)}>
            <EditIcon style={{ cursor: 'pointer'}}/>
            </div>
            </div>
            <div onClick={() => setShowDeleteModal(user.user.id)} aria-label="delete">
                <DeleteIcon style={{ cursor: 'pointer'}}/>
            </div>
            <DeleteModal
                deleteFunction={() => handleDelete(user.user.id)}
                objectName="user"
                showModal={ShowDeleteModal === user.user.id}
                onClose={() => setShowDeleteModal(null)}
            />
          </ListItem>
        ))}
         <Dialog open={modalOpen} onClose={handleClose}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense" label="Phone number" type="text" fullWidth
                        variant="outlined" value={editData.phone}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
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
                        margin="dense" label="Bio" type="text"  fullWidth
                        variant="outlined" value={editData.bio}
                        onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
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
                        margin="dense" label="Age" type="text"  fullWidth
                        variant="outlined" value={editData.age}
                        onChange={(e) => setEditData({ ...editData, age: e.target.value })}
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
                        margin="dense" label="Status" type="text"  fullWidth
                        variant="outlined" value={editData.status}
                        onChange={(e) => setEditData({ ...editData, status: e.target.value })}
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
                        margin="dense" label="Located in" type="text"  fullWidth
                        variant="outlined" value={editData.located_in}
                        onChange={(e) => setEditData({ ...editData, located_in: e.target.value })}
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
                    <button className='cancel' onClick={handleClose}>Cancel</button>
                    <button className='cancel' onClick={() => {updateUser(editData.id);
                        handleClose();}}>Confirm</button>
                </DialogActions>
            </Dialog>
      </List>
      <Dialog open={modalAddOpen} onClose={handleClose}>
                <DialogTitle>Add User</DialogTitle>
                <DialogContent>
                    <TextField
                        margin="dense" label="Full Name" type="text" fullWidth
                        variant="outlined" value={modalData.full_name}
                        onChange={(e) => setModalData({ ...modalData, full_name: e.target.value })}
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
                        margin="dense" label="Email" type="text"  fullWidth
                        variant="outlined" value={modalData.email}
                        onChange={(e) => setModalData({ ...modalData, email: e.target.value })}
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
                        margin="dense" label="Password" type="password"  fullWidth
                        variant="outlined" value={modalData.password}
                        onChange={(e) => setModalData({ ...modalData, password: e.target.value })}
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
                        margin="dense" label="Roles" type="text"  fullWidth
                        variant="outlined" value={modalData.roles}
                        onChange={(e) => setModalData({ ...modalData, roles: e.target.value })}
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
                    <button className='cancel' onClick={handleClose}>Cancel</button>
                    <button className='cancel' onClick={() => {
                        createUser();
                        handleClose();}}>Confirm</button>
                </DialogActions>
            </Dialog>
    </div>
    );
};

export default UsersList;