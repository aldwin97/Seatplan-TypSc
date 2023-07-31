import React, { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  SelectChangeEvent,
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faBell,
  faChartBar,
  faUsers,
  faProjectDiagram,
  faPowerOff,
  faFaceSmile,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import './adminMembersPage.css';

interface Machine {
    machine_id: number;
    machine_name: string;
    project_id: number;
    project_name: string;
    is_deleted: boolean;
    created_time: string;
    created_by: number;
    updated_time: string;
    updated_by: number;
  }
  interface Project {
    project_id: number;
    project_name: string;
  }
  function MachinePage() {
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // State variable to store the logged-in user ID
  const [selectedMachines, setSelectedMachines] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addMachineDialogOpen, setAddMachineDialogOpen] = useState(false);
  const [MachineInfoDialogOpen, setMachineInfoDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // Specify the type as an array of Project objects
  const [newMachine, setNewMachine] = useState<Machine>({
    machine_id: 0,
    machine_name: '',
    project_id: 0,
    project_name: '',
    is_deleted: false,
    created_time: '',
    created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    updated_time: '',
    updated_by: loggedInUserId ? Number(loggedInUserId) : 0,
  }); 
  useEffect(() => {
    // Retrieve the logged-in user ID from the session storage
    const user_id = sessionStorage.getItem('user_id');
    setLoggedInUserId(user_id ? parseInt(user_id) : null);
  }, []);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = sessionStorage.getItem('user_id');
    setLoggedInUserId(user_id ? parseInt(user_id) : null);
  }, []);

  const handleCloseDialog = () => {
    setMachineInfoDialogOpen(false);
  };

  const handleMachineCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, machineId: number) => {
    const selected = event.target.checked;

    setSelectedMachines((prevSelected) => {
      if (selected) {
        return [...prevSelected, machineId];
      } else {
        return prevSelected.filter((id) => id !== machineId);
      }
    });
  };

  const handleViewMachineInfo = (machineId: number) => {
    const machine = machines.find((machine) => machine.machine_id === machineId);
    if (machine) {
      setSelectedMachine(machine);
      setEditedMachine({ ...machine }); // Set the editedUser state with the initial values from selectedUser
      setMachineInfoDialogOpen(true);
    }
  };

  const [editMode, setEditMode] = useState(false);
  const [editedMachine, setEditedMachine] = useState<Machine | null>(null);
  
  const handleEditMachine = () => {
    setEditMode(true);
    setEditedMachine(selectedMachine);
  };
  const handleSaveMachine = () => {
    if (!editedMachine) {
      return;
    }

    const updatedMachineModel: Partial<Machine> = {
      machine_name: editedMachine?.machine_name,
      project_id: editedMachine?.project_id,
      updated_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };

    console.log('Data being updated:', updatedMachineModel);

    fetch(`http://localhost:8080/admin/update/${selectedMachine?.machine_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedMachineModel),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Machine updated successfully');
          window.location.reload();
        } else {
          response.text().then((errorMessage) => {
            console.log('Failed to update machine:', errorMessage);
          });
        }
      })
      .catch((error) => {
        console.log('Error while updating machine', error);
      });
  };

  useEffect(() => {
    fetch('http://localhost:8080/admin/showAllProject')
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.log('Error while fetching projects:', error);
      });
  }, []);
  
  const handleAddMachine = () => {
    setAddMachineDialogOpen(true); // Set the flag to open the dialog
  };
  const handleAddMachines = () => {
    const currentTime = new Date().toISOString();
    const loggedInUserId = sessionStorage.getItem('user_id');
    
  
    console.log('loggedInUserId:', loggedInUserId); // Check the value in the console
  
    const newMachineModel = {
      machine_name: newMachine.machine_name,
      project_id: newMachine.project_id,
      created_time: currentTime,
      created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };
  
    console.log('newMachineModel:', newMachineModel); // Check the newUserModel object in the console
  
  
    // Make the POST request to insert a new user
    fetch('http://localhost:8080/admin/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMachineModel),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Machine inserted successfully');
          window.location.reload();
        } else if (response.status === 400) {
          response.json().then((data) => {
            console.log('Failed to insert Machine:', data.message);
          });
        } else {
          console.log('Failed to insert Machine');
        }
      })
      .catch((error) => {
        console.log('Error while inserting Machine', error);
      });
  };
  const handleDeleteSelected = () => {
    // Make the DELETE request to delete selected users
    selectedMachines.forEach((machineId) => {
      fetch(`http://localhost:8080/admin/delete/${machineId}`, { method: 'POST' })
        .then((response) => {
          if (response.ok) {
            console.log(`User with ID ${machineId} deleted successfully`);
          } else {
            console.log(`Failed to delete user with ID ${machineId}`);
          }
        })
        .catch((error) => {
          console.log(`Error while deleting user with ID ${machineId}`, error);
        });
    });
}
    const handleMachineClick = (machineId: number) => {
        handleViewMachineInfo(machineId);
      };
    

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  const perPageOptions = [10, 30, 50];

  const handlePerPageChange = (event: SelectChangeEvent<number>) => {
    const value = event.target.value as number;
    setPerPage(value);
    setCurrentPage(1);
  };

  const projectPageHandleClick = () => {
    navigate('/ProjectPage');
  };
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

  return (
    <div className="container">
    <button className={`burgerButton ${isDropdownOpen ? 'open' : ''}`} onClick={toggleDropdown}>
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
          <FontAwesomeIcon icon={faEdit} className="icon" />
          Seat Plan Management
        </button>
        <button onClick={projectPageHandleClick} className="sub">
          <FontAwesomeIcon icon={faProjectDiagram} className="icon" />
         Projects
        </button>
      </div>
    )}

    <button className={`profile ${isProfileDropdownOpen ? 'open2' : ''}`} onClick={toggleProfileDropdown}>
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
        className={`delete-button ${selectedMachines.length > 0 ? 'active' : ''}`}
        color="primary"
        onClick={handleDeleteSelected}
        disabled={selectedMachines.length === 0}
      >
        <DeleteIcon />
      </IconButton>
      <Button className="add-user-button" color="primary" variant="contained" onClick={handleAddMachine}>
        Add Machine
      </Button>
    </Box>

    <div className="title">
      <Typography className="title-main" variant="h5" gutterBottom>
        MACHINE INFORMATION
      </Typography>
      <div className="menu-label">Items per Page:</div>
      <Select className="select-container" value={perPage} onChange={handlePerPageChange}>
        {perPageOptions.map((option) => (
          <MenuItem className="menu-container" key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
      
    </div>

    <TableContainer className="table-container" component={Paper}>
      <Table>
        <TableHead className="table-header">
          <TableRow>
          <TableCell></TableCell>
            <TableCell className="table-header">Machine</TableCell>
            <TableCell className="table-header">Project</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
  {machines.map((machine) => (
    <TableRow className="table-cell" key={machine.machine_id} hover>
      <TableCell className="checkbox-btn" padding="checkbox">
        <Checkbox
          className="checkmark"
          checked={selectedMachines.includes(machine.machine_id)}
          onChange={(event) => handleMachineCheckboxChange(event, machine.machine_id)}
        />
      </TableCell>
      <TableCell>
        <a className="user-link" href="#" onClick={() => handleMachineClick(machine.machine_id)}>
          {`${machine.machine_name}`}
        </a>
      </TableCell>
      <TableCell>{machine.project_name}</TableCell>
    </TableRow>
  ))}
</TableBody>


      </Table>
    </TableContainer>

    <Dialog open={MachineInfoDialogOpen} onClose={handleCloseDialog} fullScreen className="user-info-dialog">
<div className="user-info-page">
  <Typography variant="h5" className="user-info-title">
  {editMode ? 'Edit Information' : 'Machine Information'}
  </Typography>
  {selectedMachine && (
    <div className="user-info-content">
    <strong className="user-info-label">Machine:</strong>
    {editMode ? (
      <>
        <div className="name-input">
          <input
            className="user-info-value"
            value={`${editedMachine?.machine_name || ''}`}
            onChange={(e) => {
              setEditedMachine((prevEditedMachine: Machine | null) => ({
                ...prevEditedMachine!

              }));
            }}
          />
        </div>
      </>
    ) : (
      <span className="user-info-value">{`${selectedMachine.machine_name}`}</span>
    )}


<strong className="user-info-label">Project:</strong>{" "}
{editMode ? (
<Select
  className="user-info-value"
  value={editedMachine?.project_id || ''}
  onChange={(e) => setEditedMachine((prevEditedMachine: Machine | null) => ({ ...prevEditedMachine!, project_id: Number(e.target.value) }))}
>
  {projects.map((project) => (
    <MenuItem key={project.project_id} value={project.project_id}>
      {project.project_name}
    </MenuItem>
  ))}
</Select>
) : (
<span className="user-info-value">{selectedMachine?.project_name}</span>
)}



      <strong className="user-info-label">Created By:</strong>{" "}
<span className="user-info-value">{selectedMachine.created_by}</span>

      
      <strong className="user-info-label">Updated By:</strong>{" "}
<span className="user-info-value">{selectedMachine.updated_by}</span>


      <strong className="user-info-label">Created At:</strong>{" "}
<span className="user-info-value">{selectedMachine.created_time}</span>


<strong className="user-info-label">Updated At:</strong>{" "}
<span className="user-info-value">{selectedMachine.updated_time}</span>


    </div>
  )}

  <div className="user-info-actions">
    {editMode ? (
      <Button onClick={handleSaveMachine} color="primary" className="user-info-dialog-save-button">
        Save
      </Button>
    ) : (
      <Button onClick={handleEditMachine} color="primary" className="user-info-dialog-edit-button">
        Edit
      </Button>
    )}
    <Button  onClick={handleCloseDialog} color="primary" className="user-info-dialog-close-button">
      Close
    </Button>
  </div>
</div>
</Dialog>

<Dialog
open={addMachineDialogOpen || newMachine.machine_id !== 0}
onClose={() => setNewMachine({ ...newMachine, machine_id: 0 })}
className="add-user-dialog"
>
<DialogTitle>Add Machine</DialogTitle>
<DialogContent className="add-user-dialog-content">
  <DialogContentText>Please enter the Machine details:</DialogContentText>
  <TextField
    autoFocus
    margin="dense"
    label="Machine Name"
    type="text"
    fullWidth
    value={newMachine.machine_name}
    onChange={(e) => setNewMachine({ ...newMachine, machine_name: e.target.value })}
    required/>

  <Typography variant="subtitle1" gutterBottom>
    Project
  </Typography>
  <Select
    margin="dense"
    value={newMachine.project_id}
    onChange={(e) => setNewMachine({ ...newMachine, project_id: Number(e.target.value) })}
    fullWidth
    required>
    {projects.map((project) => (
      <MenuItem key={project.project_id} value={project.project_id}>
        {project.project_name}
      </MenuItem>
    ))}
  </Select>
</DialogContent>
<DialogActions className="add-user-dialog-actions">
  <Button onClick={() => setAddMachineDialogOpen(false)} color="primary">
    Cancel
  </Button>
  <Button onClick={handleAddMachines} color="primary">
    Add
  </Button>
</DialogActions>
</Dialog>

        </div>
  );
}
  
  export default MachinePage;