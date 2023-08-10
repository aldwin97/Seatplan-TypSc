import React, { useState, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import styles from "../dashboard_component/dashboardPage.module.css";
import {
  BusinessCenterOutlined,
  DashboardOutlined,
  ChairOutlined,
  GroupsOutlined,
  AccountCircleOutlined,
  WorkOutlineOutlined,
  Menu,
  Logout,
} from "@mui/icons-material";
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
  Pagination,
  Paper,
  IconButton,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import "./adminMembersPage.css";

interface Machine {
  user_id: number;
  first_name: string;
  project_id?: number[] | undefined;
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
  const [searchText, setSearchText] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // State variable to store the logged-in user ID
  const [selectedMachines, setSelectedMachines] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addMachineDialogOpen, setAddMachineDialogOpen] = useState(false);
  const [MachineInfoDialogOpen, setMachineInfoDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [projects, setProjects] = useState<Project[]>([]); // Update 'Project' type accordingly
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [newMachine, setNewMachine] = useState<Machine>({
    user_id: 0,
    first_name: "",
    project_id: [], // Change to an empty array for multiple selection
    project_name: "",
    is_deleted: false,
    created_time: "",
    created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    updated_time: "",
    updated_by: loggedInUserId ? Number(loggedInUserId) : 0,
  });
  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects((prevSelectedProjects) => {
      if (prevSelectedProjects.includes(projectId)) {
        return prevSelectedProjects.filter((id) => id !== projectId);
      } else {
        return [...prevSelectedProjects, projectId];
      }
    });
  };
  useEffect(() => {
    // Retrieve the logged-in user ID from the session storage
    const user_id = sessionStorage.getItem("user_id");
    setLoggedInUserId(user_id ? parseInt(user_id) : null);
  }, []);

  const [perPage, setPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const user_id = sessionStorage.getItem("user_id");
    setLoggedInUserId(user_id ? parseInt(user_id) : null);
  }, []);

  const handleCloseDialog = () => {
    setMachineInfoDialogOpen(false);
  };

  const handleMachineCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    machineId: number
  ) => {
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
    const machine = machines.find((machine) => machine.user_id === machineId);
    if (machine) {
      setSelectedMachine(machine);
      setEditedMachine({ ...machine }); // Set the editedUser state with the initial values from selectedUser
      setMachineInfoDialogOpen(true);
    }
  };
  const handleAddMachine = () => {
    setAddMachineDialogOpen(true); // Set the flag to open the dialog
  };

  const filteredMachine = machines
    .filter((machine) =>
      machine.first_name.toLowerCase().includes(searchText.toLowerCase())
    )
    .map((machine) => {
      let formattedCreatedTime = "Invalid date";
      let formattedUpdatedTime = "Invalid date";

      if (
        machine.created_time &&
        typeof machine.created_time === "string" &&
        machine.created_time.trim() !== ""
      ) {
        formattedCreatedTime = machine.created_time;
      }

      if (
        machine.updated_time &&
        typeof machine.updated_time === "string" &&
        machine.updated_time.trim() !== ""
      ) {
        formattedUpdatedTime = machine.updated_time;
      }

      return {
        ...machine,
        created_time: formattedCreatedTime,
        updated_time: formattedUpdatedTime,
      };
    });

  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentMachines = filteredMachine.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

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
      user_id: selectedMachine?.user_id,
      first_name: editedMachine?.first_name || "",
      project_id: editMode ? selectedProjects : editedMachine?.project_id || [], // Use selectedProjects when in edit mode, otherwise use the old projects
      updated_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };
    console.log("Data being updated:", updatedMachineModel);

    fetch(
      `http://localhost:8080/machine/updateMachine/${selectedMachine?.user_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMachineModel),
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("Machine updated successfully");
          handleCloseDialog();
          window.location.reload();
        } else {
          response.text().then((errorMessage) => {
            console.log("Failed to update machine:", errorMessage);
          });
        }
      })
      .catch((error) => {
        console.log("Error while updating machine", error);
      });
  };

  useEffect(() => {
    fetch("http://localhost:8080/admin/showAllProject")
      .then((response) => response.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => {
        console.log("Error while fetching projects:", error);
      });
  }, []);

  // Fetch all machines from the backend API
  useEffect(() => {
    fetch("http://localhost:8080/machine/showAllMachine")
      .then((response) => response.json())
      .then((data) => {
        setMachines(data);
      })
      .catch((error) => {
        console.log("Error while fetching machines:", error);
      });
  }, []);

  const handleAddMachines = () => {
    const loggedInUserId = sessionStorage.getItem("user_id");

    const newMachineModel = {
      first_name: newMachine.first_name,

      created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };

    // Send the POST request to insert the new machine
    fetch("http://localhost:8080/machine/insertNewMachine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMachineModel),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Machine inserted successfully");
          setAddMachineDialogOpen(false);
          // Reload the machine list or update the state as needed
          window.location.reload();
        } else {
          console.log("Failed to insert Machine");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log("Error while inserting Machine", error);
      });
  };

  const handleDeleteSelected = () => {
    // Make the DELETE request to delete selected users
    selectedMachines.forEach((machineId) => {
      fetch(`http://localhost:8080/admin/delete/${machineId}`, {
        method: "POST",
      })
        .then((response) => {
          if (response.ok) {
            console.log(`User with ID ${machineId} deleted successfully`);
            window.location.reload();
          } else {
            console.log(`Failed to delete user with ID ${machineId}`);
          }
        })
        .catch((error) => {
          console.log(`Error while deleting user with ID ${machineId}`, error);
        });
    });
  };
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

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const MachinePageHandleClick = () => {
    navigate("/machinetablePage");
  };
  const projectPageHandleClick = () => {
    navigate("/ProjectPage");
  };
  const dashboardPageHandleClick = () => {
    navigate("/DashboardPage");
  };
  const adminPageHandleClick = () => {
    navigate("/AdminPage");
  };
  const ProfilePageHandleClick = () => {
    navigate("/ProfilePage");
  };
  const SeatplanPageHandleClick = () => {
    navigate("/seatPlanPage");
  };
  const logInPageHandleClick = (): void => {
    navigate("/");
  };
  const handleLogout = () => {
    // Clear any user-related data from the session/local storage
    sessionStorage.removeItem("user_id");

    // Redirect to the login page
    navigate("/");
  };

  const sortedCurrentMachines = currentMachines.sort((a, b) => {
    const nameA = `${a.first_name}`.toLowerCase();
    const nameB = `${b.first_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  return (
    <div className="container">
      <i className={styles["menu-out"]} onClick={toggleDrawer}>
        <Menu style={{ fontSize: "28px" }} />
      </i>

      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        variant="persistent"
        className={
          isDrawerOpen ? styles["sidebar-open"] : styles["sidebar-closed"]
        }
      >
        <div className={styles["page-sidebar"]}>
          <div className={styles["logo-box"]}>
            <span className={styles["logo-text"]}>Seat</span>
            <i className={styles["menu"]} onClick={toggleDrawer}>
              <Menu style={{ fontSize: "28px" }} />
            </i>
            <div
              className={`${styles["page-sidebar-inner"]} ${styles["slimscroll"]}`}
            >
              <ul className={styles["accordion-menu"]}>
                <li className={styles["sidebar-title"]}>Apps</li>
                <li>
                  <a
                    onClick={dashboardPageHandleClick}
                    className={styles["active"]}
                  >
                    <i className={styles["material-icons"]}>
                      <DashboardOutlined />
                    </i>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    onClick={ProfilePageHandleClick}
                    className={styles["material-icons"]}
                  >
                    <i
                      className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <AccountCircleOutlined />
                    </i>
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    onClick={projectPageHandleClick}
                    className={styles["material-icons"]}
                  >
                    <i
                      className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <WorkOutlineOutlined />
                    </i>
                    Project
                  </a>
                </li>
                <li className={styles["active-page"]}>
                  <a
                    onClick={MachinePageHandleClick}
                    className={styles["material-icons"]}
                  >
                    <i
                      className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <BusinessCenterOutlined />
                    </i>
                    Machine
                  </a>
                </li>
                <li></li>
                <li>
                  <a
                    onClick={adminPageHandleClick}
                    className={styles["material-icons"]}
                  >
                    <i
                      className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <GroupsOutlined />
                    </i>
                    Members
                  </a>
                </li>
                <li>
                  <a
                    onClick={SeatplanPageHandleClick}
                    className={styles["material-icons"]}
                  >
                    <i
                      className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <ChairOutlined />
                    </i>
                    Seat
                  </a>
                </li>
                <li>
                  <a
                    onClick={handleLogout}
                    className={styles["material-icons"]}
                  >
                    <i
                      className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <Logout />
                    </i>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SwipeableDrawer>

      <Box className="action-buttons" display="flex" justifyContent="flex-end">
        <IconButton
          className={`delete-button ${
            selectedMachines.length > 0 ? "active" : ""
          }`}
          color="primary"
          onClick={handleDeleteSelected}
          disabled={selectedMachines.length === 0}
        >
          <DeleteIcon />
        </IconButton>
        <Button
          className="add-user-button"
          color="primary"
          variant="contained"
          onClick={handleAddMachine}
        >
          Add Machine
        </Button>
      </Box>

      <div className="title">
        <Typography className="title-main" variant="h5" gutterBottom>
          MACHINE INFORMATION
        </Typography>
        <div className="menu-label">Items per Page:</div>
        <Select
          className="select-container"
          value={perPage}
          onChange={handlePerPageChange}
        >
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
            {sortedCurrentMachines.map((machine) => (
              <TableRow className="table-cell" key={machine.user_id} hover>
                <TableCell className="checkbox-btn" padding="checkbox">
                  <Checkbox
                    className="checkmark"
                    checked={selectedMachines.includes(machine.user_id)}
                    onChange={(event) =>
                      handleMachineCheckboxChange(event, machine.user_id)
                    }
                  />
                </TableCell>
                <TableCell>
                  <a
                    className="user-link"
                    href="#"
                    onClick={() => handleMachineClick(machine.user_id)}
                  >
                    {`${machine.first_name}`}
                  </a>
                </TableCell>
                <TableCell>{machine.project_name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        className="pagination-container"
        display="flex"
        justifyContent="center"
        marginTop={2}
      >
        <Pagination
          count={Math.ceil(filteredMachine.length / perPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>

      <Dialog
        open={MachineInfoDialogOpen}
        onClose={handleCloseDialog}
        fullScreen
        className="user-info-dialog"
      >
        <div className="user-info-page">
          <Typography variant="h5" className="user-info-title">
            {editMode ? "Edit Information" : "Machine Information"}
          </Typography>
          {selectedMachine && (
            <div className="user-info-content">
              <strong className="user-info-label">Machine:</strong>
              {editMode ? (
                <div className="name-input">
                  <input
                    className="user-info-value"
                    value={editedMachine?.first_name || ""}
                    onChange={(e) => {
                      const firstName = e.target.value;
                      setEditedMachine((prevEditedMachine: Machine | null) => ({
                        ...prevEditedMachine!,
                        first_name: firstName,
                      }));
                    }}
                  />
                </div>
              ) : (
                <span className="user-info-value">
                  {selectedMachine?.first_name}
                </span>
              )}
              <strong className="user-info-label">Project:</strong>{" "}
              {editMode ? (
                <div className="user-info-value">
                  <Select
                    multiple
                    value={selectedProjects}
                    onChange={(e) => {
                      const target = e.target as unknown;
                      if (target instanceof HTMLSelectElement) {
                        const selectedValues: number[] = Array.from(
                          target.selectedOptions,
                          (option) => Number(option.value)
                        );
                        setSelectedProjects(selectedValues);
                      }
                    }}
                  >
                    {projects.map((project) => (
                      <MenuItem
                        key={project.project_id}
                        value={project.project_id}
                      >
                        <Checkbox
                          checked={selectedProjects.includes(
                            project.project_id
                          )}
                          color="primary"
                          onClick={() =>
                            toggleProjectSelection(project.project_id)
                          }
                        />
                        {project.project_name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
              ) : (
                <span className="user-info-value">
                  {selectedMachine?.project_name}
                </span>
              )}
            </div>
          )}

          <div className="user-info-actions">
            {editMode ? (
              <Button
                onClick={handleSaveMachine}
                color="primary"
                className="user-info-dialog-save-button"
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={handleEditMachine}
                color="primary"
                className="user-info-dialog-edit-button"
              >
                Edit
              </Button>
            )}
            <Button
              onClick={handleCloseDialog}
              color="primary"
              className="user-info-dialog-close-button"
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={addMachineDialogOpen || newMachine.user_id !== 0}
        onClose={() => setNewMachine({ ...newMachine, user_id: 0 })}
        className="add-user-dialog"
      >
        <DialogTitle>Add Machine</DialogTitle>
        <DialogContent className="add-user-dialog-content">
          <DialogContentText>
            Please enter the Machine details:
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Machine Name"
            type="text"
            fullWidth
            value={newMachine.first_name}
            onChange={(e) =>
              setNewMachine({ ...newMachine, first_name: e.target.value })
            }
            required
          />
        </DialogContent>
        <DialogActions className="add-user-dialog-actions">
          <Button
            onClick={() => setAddMachineDialogOpen(false)}
            color="primary"
          >
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
