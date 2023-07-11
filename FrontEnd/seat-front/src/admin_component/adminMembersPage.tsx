import React, { useState, useEffect } from 'react';
import { Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Paper, IconButton, Button, Typography, Box, Pagination, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import './adminMembersPage.css';

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_num: number;
  username: string;
  password: string;
  staffstatus_id: number;
  usertype_id: number;
  position_id: number;
  user_picture: string;
  is_deleted: boolean;
  created_time: string;
  created_by: number;
  updated_time: string;
  updated_by: number;
}

const AdminMembersPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userInfoDialogOpen, setUserInfoDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<User>({
    user_id: 0,
    first_name: '',
    last_name: '',
    email: '',
    mobile_num: 0,
    username: '',
    password: '',
    staffstatus_id: 0,
    usertype_id: 0,
    position_id: 0,
    user_picture: '',
    is_deleted: false,
    created_time: '',
    created_by: 0,
    updated_time: '',
    updated_by: 0,
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
    const user = users.find((user) => user.user_id === userId);
    if (user) {
      setSelectedUser(user);
      setUserInfoDialogOpen(true);
    }
  };

  const handleUserClick = (userId: number) => {
    handleViewUserInfo(userId);
  };

  const handleDeleteSelected = () => {
    // Make the DELETE request to delete selected users
    selectedUsers.forEach((userId) => {
      fetch(`http://localhost:8080/admin/delete/${userId}`, { method: 'POST' })
        .then((response) => {
          if (response.ok) {
            console.log(`User with ID ${userId} deleted successfully`);
          } else {
            console.log(`Failed to delete user with ID ${userId}`);
          }
        })
        .catch((error) => {
          console.log(`Error while deleting user with ID ${userId}`, error);
        });
    });

    // Update the users state to remove the deleted users
    const remainingUsers = users.filter((user) => !selectedUsers.includes(user.user_id));
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
      user_id: users.length + 1,
      created_time: currentTime,
      created_by: 1,
      updated_time: '',
      updated_by: 0,
    };

    // Make the POST request to insert a new user
    fetch('http://localhost:8080/admin/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    })
    
      .then((response) => {
        if (response.ok) {
          console.log('User inserted successfully');
          setUsers([...users, updatedUser]);
          setNewUser({
            user_id: 0,
            first_name: '',
            last_name: '',
            email: '',
            mobile_num: 0,
            username: '',
            password: '',
            staffstatus_id: 0,
            usertype_id: 0,
            position_id: 0,
            user_picture: '',
            is_deleted: false,
            created_time: '',
            created_by: 0,
            updated_time: '',
            updated_by: 0,
          });
          setAddUserDialogOpen(false); // Set the flag to close the dialog
        } else {
          console.log('Failed to insert user');
        }
      })
      .catch((error) => {
        console.log('Error while inserting user', error);
      });
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
      user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
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
        updated_time: currentTime,
      };

      // Make the PUT request to update the user
      fetch(`http://localhost:8080/admin/update/${updatedUser.user_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (response.ok) {
            console.log('User updated successfully');
            const updatedUsers = users.map((user) => {
              if (user.user_id === updatedUser.user_id) {
                return updatedUser;
              } else {
                return user;
              }
            });
            setUsers(updatedUsers);
            setEditMode(false);
            setSelectedUser(updatedUser);
          } else {
            console.log('Failed to update user');
          }
        })
        .catch((error) => {
          console.log('Error while updating user', error);
        });
    }
  };

  useEffect(() => {
    // Make the GET request to fetch users data
    fetch('http://localhost:8080/admin/showAllUser')
      .then((response) => response.json())
      .then((data) => {
        console.log('Users data:', data);
        setUsers(data);
      })
      .catch((error) => {
        console.log('Error while fetching users data', error);
      });
  }, []);
  

  const dashboardPageHandleClick = () => {
    navigate('/DashboardPage');
  };
  const adminPageHandleClick = () => {
    navigate('/AdminPage');
  };
  const seatplanPageHandleClick = () => {
    navigate('/SeatplanPage');
  };
  const logInPageHandleClick = () => {
    navigate('/');
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [currDate, setCurrDate] = useState('');
  const [currTime, setCurrTime] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();
      setCurrDate(formattedDate);
      setCurrTime(formattedTime);
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);
  

  return (
    
    <div className="container">

<button className={`burgerButton ${isDropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
  <div className="burgerIcon"></div>
  <div className="burgerIcon"></div>
  <div className="burgerIcon"></div>
</button>


{isDropdownOpen && (
  <div className="dropdownMenu dropdownRows">
    <button onClick={dashboardPageHandleClick} className="sub">
      <FontAwesomeIcon icon={faChartBar} className="icon" />
      Dashboard
    </button>
    <button onClick={adminPageHandleClick} className="sub">
      <FontAwesomeIcon icon={faUsers} className="icon" />
      Members
    </button>
    <button onClick={seatplanPageHandleClick} className="sub">
      <FontAwesomeIcon icon={faProjectDiagram} className="icon" />
      Projects
    </button>
  </div>
)}

<button className={`profile ${isProfileDropdownOpen ? "open2" : ""}`} onClick={toggleProfileDropdown}>
  <FontAwesomeIcon icon={faUser} />
</button>

{isProfileDropdownOpen && (
  <div className="dropdownMenu2">
    <button className="sub">
      <FontAwesomeIcon icon={faFaceSmile} className="icon" />
      Profile
    </button>
    <button onClick={logInPageHandleClick} className="sub">
      <FontAwesomeIcon icon={faPowerOff} className="icon" />
      Logout
    </button>
  </div>
)}

<button className="notif">
  <FontAwesomeIcon icon={faBell} />
</button>

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
                {users.map((user) => (
                  <TableRow key={user.user_id} hover>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.user_id)}
                        onChange={(event) => handleUserCheckboxChange(event, user.user_id)}
                      />
                    </TableCell>
                    <TableCell>
                      <a className="user-link" href="#" onClick={() => handleUserClick(user.user_id)}>
                        {`${user.first_name} ${user.last_name}`}
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

          <Dialog
  open={userInfoDialogOpen}
  onClose={handleCloseDialog}
  fullScreen
  className="user-info-dialog"
>
          <div className="user-info-page">
    
  <Typography variant="h5" className="user-info-title">
    {editMode ? 'EDIT USER INFORMATION' : 'USER INFORMATION'}
  </Typography>
  {selectedUser && (
    <div className="user-info-content">
      <strong className="user-info-label">Name:</strong>
      {editMode ? (
        <React.Fragment>
          <div className="name-label">First Name:</div>
          <TextField
            className="user-info-value"
            value={editedUser?.first_name || ''}
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
            value={editedUser?.last_name || ''}
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
        <span className="user-info-value">{`${selectedUser.first_name} ${selectedUser.last_name}`}</span>
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
          value={editedUser?.mobile_num}
          onChange={(e) =>
            setEditedUser((prevEditedUser: User | null) => ({
              ...prevEditedUser!,
              contact: parseInt(e.target.value)
            }))
          }
        />
      ) : (
        <span className="user-info-value">{selectedUser.mobile_num}</span>
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
      <span className="user-info-value">{selectedUser.usertype_id}</span> <br />

      <strong className="user-info-label">Position:</strong>{" "}
      {editMode ? (
        <TextField
          className="user-info-value"
          value={editedUser?.position_id}
          onChange={(e) =>
            setEditedUser((prevEditedUser: User | null) => ({
              ...prevEditedUser!,
              position: e.target.value
            }))
          }
        />
      ) : (
        <span className="user-info-value">{selectedUser.position_id}</span>
      )}
      <br />

      <strong className="user-info-label">Created At:</strong>{" "}
      <span className="user-info-value">{selectedUser.created_time}</span> <br />

      <strong className="user-info-label">Created By:</strong>{" "}
      <span className="user-info-value">{selectedUser.created_by}</span> <br />

      <strong className="user-info-label">Updated At:</strong>{" "}
      {editMode ? (
        <span className="user-info-value">{selectedUser.updated_time}</span>
      ) : (
        <span className="user-info-value">{editedUser?.updated_time || selectedUser.updated_time}</span>
      )}
      {/* Display the updated date */}
    </div>
  )}

  <div className="user-info-actions">
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
  </div>
</div>
</Dialog>
          <Dialog open={addUserDialogOpen || newUser.user_id !== 0} onClose={() => setNewUser({ ...newUser, user_id: 0 })} className="add-user-dialog">
          <DialogTitle>Add User</DialogTitle>
          <DialogContent className="add-user-dialog-content">
            <DialogContentText>Please enter the user details:</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="First Name"
              type="text"
              fullWidth
              value={newUser.first_name}
              onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Last Name"
              type="text"
              fullWidth
              value={newUser.last_name}
              onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
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
              value={newUser.mobile_num}
              onChange={(e) => setNewUser({ ...newUser, mobile_num: parseInt(e.target.value) })}
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <Select
              margin="dense"
              label="Position ID"
              type="number"
              fullWidth
              value={newUser.position_id}
              onChange={(e) => setNewUser({ ...newUser, position_id: Number(e.target.value) })}
            >
              <MenuItem value={1}>Design Engineer</MenuItem>
              <MenuItem value={2}>OJT</MenuItem>
              
            </Select>
            <Select
              margin="dense"
              label="UserType ID"
              value={newUser.usertype_id}
              onChange={(e) => setNewUser({ ...newUser, usertype_id: Number(e.target.value) })}
              fullWidth
            >
              <MenuItem value={1}>Viewer</MenuItem>
              <MenuItem value={2}>Editor</MenuItem>
              <MenuItem value={3}>Admin</MenuItem>
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