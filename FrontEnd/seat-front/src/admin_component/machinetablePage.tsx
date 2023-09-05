import React, { useState, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { MdCancel } from "react-icons/md"; // Import the cancel icon

import styles from "../dashboard_component/dashboardPage.module.css";
import { Avatar } from "@mui/material";
import axios from "axios";
import defaulImage from "../assets/default.png";
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
interface UserData {
  first_name: string;
  last_name: string;
  position_name: string;
}
function MachinePage() {
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [UserData, setUserData] = useState<UserData | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // State variable to store the logged-in user ID
  const [selectedMachines, setSelectedMachines] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addMachineDialogOpen, setAddMachineDialogOpen] = useState(false);
  const [MachineInfoDialogOpen, setMachineInfoDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
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
    const fetchUserPicture = async () => {
      try {
        const user_id = window.sessionStorage.getItem("user_id");
        const pictureResponse = await axios.get(
          `/seat/profile/userPicture/${user_id}`,
          {
            responseType: "arraybuffer",
          }
        );

        const base64Data = btoa(
          new Uint8Array(pictureResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const pictureDataUrl = `data:${pictureResponse.headers[
          "content-type"
        ].toLowerCase()};base64,${base64Data}`;
        setUserPicture(pictureDataUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchUserPicture();
  }, []);

  useEffect(() => {
    const user_id = window.sessionStorage.getItem("user_id");

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `/seat/dashboard/showLogedUserInfo/${user_id}`
        );

        const responseData: UserData = response.data[0];
        setUserData(responseData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData();
  }, []);
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

    fetch(`/seat/machine/updateMachine/${selectedMachine?.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedMachineModel),
    })
      .then((response) => {
        if (response.ok) {
          console.log("Machine updated successfully");
          window.location.reload();
          handleCloseDialog();
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
    fetch("/seat/admin/showAllProject")
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
    fetch("/seat/machine/showAllMachine")
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
    fetch("/seat/machine/insertNewMachine", {
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
          window.location.reload();
          // Reload the machine list or update the state as needed
        } else {
          console.log("Failed to insert Machine");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.log("Error while inserting Machine", error);
        window.location.reload();
      });
  };

  const handleDeleteMachine = (machineId: number) => {
    fetch(`/seat/admin/delete/${machineId}`, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          console.log(`Machine with ID ${machineId} deleted successfully`);
          // Remove the deleted machine from the state
          const updatedMachines = currentMachines.filter(
            (machine) => machine.user_id !== machineId
          );
          setMachines(updatedMachines);
        } else {
          console.log(`Failed to delete machine with ID ${machineId}`);
        }
      })
      .catch((error) => {
        console.log(`Error while deleting machine with ID ${machineId}`, error);
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
                <div
                  className="accordion-menu-container"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <div className={styles["userbg"]}>
                    <div className={styles["userpr"]}>
                      {userPicture ? (
                        <Avatar src={userPicture} alt="User" />
                      ) : (
                        <img
                          src={defaulImage}
                          alt="Profile Default"
                          className={styles.defaultImage} // Add any additional styles here
                        />
                      )}
                    </div>
                  </div>
                  {UserData ? (
                    <div className={styles["usern"]}>
                      {UserData.first_name} {UserData.last_name}
                      <div className={styles["userp"]}>
                        {UserData.position_name}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <li className={styles["sidebar-title"]}> </li>
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
              onClick={() => setShowLogoutConfirmation(true)}
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

                {showLogoutConfirmation && (
                  <div className={styles.popupModal}>
                    <div className={styles.popupContent}>
                      <p className={styles.popupText}>
                        Are you sure you want to log out?
                      </p>
                      <div className={styles.buttonRow}>
                        <button
                          className={styles.popupButton}
                          onClick={() => {
                            handleLogout();
                            setShowLogoutConfirmation(false);
                          }}
                        >
                          <span>Okay</span>{" "}
                          <FaSignOutAlt className={styles.buttonIcon} />
                        </button>
                        <button
                          className={styles.popupButtonNo}
                          onClick={() => setShowLogoutConfirmation(false)}
                        >
                          <span>Cancel</span>{" "}
                          <MdCancel className={styles.buttonIcon} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </ul>
            </div>
          </div>
        </div>
      </SwipeableDrawer>

      <Box className="action-buttons" display="flex" justifyContent="flex-end">
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
              <TableCell className="table-header">Actions</TableCell>{" "}
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedCurrentMachines.map((machine) => (
              <TableRow className="table-cell" key={machine.user_id} hover>
                <TableCell
                  className="checkbox-btn"
                  padding="checkbox"
                ></TableCell>
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
                <TableCell>
                  <IconButton
                    className="delete-button"
                    color="primary"
                    onClick={() => handleDeleteMachine(machine.user_id)}
                  >
                    <DeleteIcon style={{ color: "gray" }} />
                  </IconButton>
                </TableCell>
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
