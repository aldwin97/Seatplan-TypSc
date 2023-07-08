import React, { useState } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { makeStyles } from '@mui/styles';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import './adminMembersPage.css';

const useStyles = makeStyles({
  container: {
    width: '200px',
    padding: '8px',
    backgroundColor: '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginRight: '10px',
  },
});

interface User {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  contact: number;
  password: string;
  position: string;
  usertype: string;
  created_time: string;
  created_by: string;
  updatedAt: string; // Added field for tracking last update
}

const AdminMembersPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userInfoDialogOpen, setUserInfoDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    id: 0,
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    contact: 0,
    password: '',
    position: '',
    usertype: '',
    created_time: '',
    created_by: '',
    updatedAt: '', // Add the updatedAt field
  });
  
  const [perPage, setPerPage] = useState(8);
  const navigate = useNavigate();

  const handleCloseDialog = () => {
    setUserInfoDialogOpen(false);
    setAddUserDialogOpen(false);
  };

  const handleUserCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, userId: number) => {
    const selected = event.target.checked;

    setSelectedUsers((prevSelected) => {
      if (selected) {
        return [...prevSelected, userId];
      } else {
        return prevSelected.filter((id) => id !== userId);
      }
    });
  };

  const handleViewUserInfo = (userId: number) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setUserInfoDialogOpen(true);
    }
  };

  const handleUserClick = (userId: number) => {
    handleViewUserInfo(userId);
  };

  const handleDeleteSelected = () => {
    const remainingUsers = users.filter((user) => !selectedUsers.includes(user.id));
    setSelectedUsers([]);
    setCurrentPage(1);
    setUsers(remainingUsers);
  };

  const handleAddUser = () => {
    setAddUserDialogOpen(true); // Set the flag to open the dialog
  };

  const handleAddUsers = () => {
    const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const updatedUser: User = {
      ...newUser,
      id: users.length + 1,
      created_time: currentTime,
      created_by: 'Admin',
      updatedAt: '', // Initialize with empty string
    };

    setUsers([...users, updatedUser]);
    setNewUser({
      id: 0,
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      contact: 0,
      password: '',
      position: '',
      usertype: '',
      created_time: '',
      created_by: '',
      updatedAt: '', // Initialize with empty string
    });

    setAddUserDialogOpen(false); // Set the flag to close the dialog
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const perPageOptions = [2, 5, 10];

  const handlePerPageChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setPerPage(value);
    setCurrentPage(1);
  };

  const [searchText, setSearchText] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      user.username.toLowerCase().includes(searchText.toLowerCase())
  );

  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);

  const handleEditUser = () => {
    setEditMode(true);
    setEditedUser(selectedUser);
  };

  const handleSaveUser = () => {
    if (editedUser) {
      const currentTime = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const updatedUser: User = {
        ...editedUser,
        updatedAt: currentTime, // Set the updated time
      };
  
      const updatedUsers = users.map((user) => {
        if (user.id === updatedUser.id) {
          return updatedUser;
        }
        return user;
      });
  
      setUsers(updatedUsers);
      setEditMode(false);
      setEditedUser(null);
      handleCloseDialog(); // Close the dialog box
    }
  };
  
  
  

  return (
    <div className="container">
      <Box className="action-buttons" display="flex" justifyContent="flex-end">
        <IconButton
          className={`delete-button ${selectedUsers.length > 0 ? 'active' : ''}`}
          color="primary"
          onClick={handleDeleteSelected}
          disabled={selectedUsers.length === 0}
        >
          <DeleteIcon />
        </IconButton>
        <Button className="add-user-button" color="primary" variant="contained" onClick={handleAddUser}>
          Add User
        </Button>
      </Box>
      <div className="title">
        <Typography className="title-main" variant="h5" gutterBottom>
          USER INFORMATION
        </Typography>
        <div className="menu-label">Items per Page:</div>
        <Select className="select-container" value={perPage} onChange={handlePerPageChange}>
          {perPageOptions.map((option) => (
            <MenuItem className="menu-container" key={option} value={option}>
            {option}
          </MenuItem>
          ))}
          </Select>
          <div className="search-bar">
            <TextField className="search-bar" label="Search" variant="outlined" value={searchText} onChange={handleSearch} />
          </div>
          </div>
          <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onChange={(event) => handleUserCheckboxChange(event, user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <a className="user-link" href="#" onClick={() => handleUserClick(user.id)}>
                      {`${user.firstName} ${user.lastName}`}
                    </a>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </TableContainer>
          <Box className="pagination-container" display="flex" justifyContent="center" marginTop={2}>
          <Pagination count={Math.ceil(filteredUsers.length / perPage)} page={currentPage} onChange={handlePageChange} color="primary" />
          </Box>
          <Dialog open={userInfoDialogOpen} onClose={handleCloseDialog} className="user-info-dialog">
            <DialogTitle className="user-info-dialog-title">
              {editMode ? "Editing User Information" : "User Information"}
            </DialogTitle>
            <DialogContent className="user-info-content">
              {selectedUser && (
                <DialogContentText className="user-info-dialog-content-text">
                  <strong className="user-info-label">Name:</strong>
                  {editMode ? (
                    <React.Fragment>
                      <div className="name-label">First Name:</div>
                      <TextField
                        className="user-info-value"
                        value={editedUser?.firstName || ''}
                        onChange={(e) => {
                          const firstName = e.target.value;
                          setEditedUser((prevEditedUser: User | null) => ({
                            ...prevEditedUser!,
                            firstName: firstName || '',
                          }));
                        }}
                      />
                      <div className="name-label">Last Name:</div>
                      <TextField
                        className="user-info-value"
                        value={editedUser?.lastName || ''}
                        onChange={(e) => {
                          const lastName = e.target.value;
                          setEditedUser((prevEditedUser: User | null) => ({
                            ...prevEditedUser!,
                            lastName: lastName || '',
                          }));
                        }}
                      />
                    </React.Fragment>
                  ) : (
                    <span className="user-info-value">{`${selectedUser.firstName} ${selectedUser.lastName}`}</span>
                  )}
                  <br />

                          <strong className="user-info-label">Username:</strong>
                          {editMode ? (
                            <TextField
                              className="user-info-value"
                              value={editedUser?.username}
                              onChange={(e) =>
                                setEditedUser((prevEditedUser: User | null) => ({
                                  ...prevEditedUser!,
                                  username: e.target.value
                                }))
                              }
                            />
                          ) : (
                            <span className="user-info-value">{selectedUser.username}</span>
                          )}
                          <br />
                          <strong className="user-info-label">Email:</strong>
                          {editMode ? (
                            <TextField
                              className="user-info-value"
                              value={editedUser?.email}
                              onChange={(e) =>
                                setEditedUser((prevEditedUser: User | null) => ({
                                  ...prevEditedUser!,
                                  email: e.target.value
                                }))
                              }
                            />
                          ) : (
                            <span className="user-info-value">{selectedUser.email}</span>
                          )}
                          <br />
                          <strong className="user-info-label">Contact:</strong>{" "}
                          {editMode ? (
                            <TextField
                              className="user-info-value"
                              value={editedUser?.contact}
                              onChange={(e) =>
                                setEditedUser((prevEditedUser: User | null) => ({
                                  ...prevEditedUser!,
                                  contact: parseInt(e.target.value)
                                }))
                              }
                            />
                          ) : (
                            <span className="user-info-value">{selectedUser.contact}</span>
                          )}
                          <br />
                          <strong className="user-info-label">Password:</strong>{" "}
                          {editMode ? (
                            <TextField
                              className="user-info-value"
                              type="password"
                              value={editedUser?.password || ''}
                              onChange={(e) =>
                                setEditedUser((prevEditedUser: User | null) => ({
                                  ...prevEditedUser!,
                                  password: e.target.value
                                }))
                              }
                            />
                          ) : (
                            <span className="user-info-value">{selectedUser.password ? "********" : ""}</span>
                          )}
                          <br />
                          <strong className="user-info-label">UserType:</strong>{" "}
                          <span className="user-info-value">{selectedUser.usertype}</span> <br />
                          <strong className="user-info-label">Position:</strong>{" "}
                          {editMode ? (
                            <TextField
                              className="user-info-value"
                              value={editedUser?.position}
                              onChange={(e) =>
                                setEditedUser((prevEditedUser: User | null) => ({
                                  ...prevEditedUser!,
                                  position: e.target.value
                                }))
                              }
                            />
                          ) : (
                            <span className="user-info-value">{selectedUser.position}</span>
                          )}
                          <br />
                          <strong className="user-info-label">Created At:</strong>{" "}
                          <span className="user-info-value">{selectedUser.created_time}</span> <br />
                          <strong className="user-info-label">Created By:</strong>{" "}
                          <span className="user-info-value">{selectedUser.created_by}</span> <br />
                          <strong className="user-info-label">Updated At:</strong>{" "}
                  {editMode ? (
                    <span className="user-info-value">{selectedUser.updatedAt}</span>
                  ) : (
                    <span className="user-info-value">{editedUser?.updatedAt || selectedUser.updatedAt}</span>
                  )}
                  {/* Display the updated date */}
                </DialogContentText>
              )}
            </DialogContent>
            <DialogActions className="user-info-actions">
              {editMode ? (
                <Button onClick={handleSaveUser} color="primary" className="user-info-dialog-save-button">
                  Save
                </Button>
              ) : (
                <Button onClick={handleEditUser} color="primary" className="user-info-dialog-edit-button">
                  Edit
                </Button>
              )}
              <Button onClick={handleCloseDialog} color="primary" className="user-info-dialog-close-button">
                Close
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog open={addUserDialogOpen || newUser.id !== 0} onClose={() => setNewUser({ ...newUser, id: 0 })} className="add-user-dialog">
          <DialogTitle>Add User</DialogTitle>
          <DialogContent className="add-user-dialog-content">
            <DialogContentText>Please enter the user details:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              value={newUser.firstName}
              onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              value={newUser.lastName}
              onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Contact"
              type="number"
              fullWidth
              value={newUser.contact}
              onChange={(e) => setNewUser({ ...newUser, contact: parseInt(e.target.value) })}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Position"
              type="text"
              fullWidth
              value={newUser.position}
              onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
            />
            <Select
              margin="dense"
              label="UserType"
              value={newUser.usertype}
              onChange={(e) => setNewUser({ ...newUser, usertype: e.target.value as string })}
              fullWidth
            >
              <MenuItem value="Viewer">Viewer</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Editor">Editor</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions className="add-user-dialog-actions">
            <Button onClick={() => setAddUserDialogOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleAddUsers} color="primary">
              Add
            </Button>
          </DialogActions>
          </Dialog>
          </div>
          );
          };
          
          export default AdminMembersPage;