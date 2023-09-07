import React, { useState, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { FaSignOutAlt } from "react-icons/fa"; // Import the logout icon
import { MdCancel } from "react-icons/md"; // Import the cancel icon
import PersonIcon from '@mui/icons-material/Person';
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
  Snackbar,
  Alert,
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@material-ui/icons/Search";

import "./adminMembersPage.css";

interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile_num: number;
  username: string;
  password: string;
  usertype_id: number;
  usertype_name: string;
  position_name: string;
  position_id: number;
  project_id?: number[] | undefined;
  project_name: string;
  user_picture: string;
  is_deleted: boolean;
  created_time: string;
  created_by: number;
  updated_time: string;
  updated_by: number;
}

interface UserType {
  usertype_id: number;
  usertype_name: string;
}

interface Position {
  position_id: number;
  position_name: string;
}

interface StaffStatus {
  staffstatus_id: number;
  staffstatus_name: string;
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

const AdminMembersPage: React.FC = () => {
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [UserData, setUserData] = useState<UserData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [addUserDialogOpen, setAddUserDialogOpen] = useState(false);
  const [userInfoDialogOpen, setUserInfoDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null); // State variable to store the logged-in user ID
  const [projects, setProjects] = useState<Project[]>([]); // Update 'Project' type accordingly
  const [selectedProjects, setSelectedProjects] = useState<number[]>([]);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const toggleProjectSelection = (projectId: number) => {
    setSelectedProjects((prevSelectedProjects) => {
      if (prevSelectedProjects.includes(projectId)) {
        return prevSelectedProjects.filter((id) => id !== projectId);
      } else {
        return [...prevSelectedProjects, projectId];
      }
    });
  };
  const [newUser, setNewUser] = useState<User>({
    user_id: 0,
    first_name: "",
    last_name: "",
    email: "",
    mobile_num: 0,
    username: "",
    password: "",
    usertype_name: "",
    position_name: "",
    usertype_id: 0,
    position_id: 0,
    project_id: [], // Change to an empty array for multiple selection
    project_name: "",
    user_picture: "",
    is_deleted: false,
    created_time: "",
    created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    updated_time: "",
    updated_by: loggedInUserId ? Number(loggedInUserId) : 0,
  });
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

  const handleCloseDialog = () => {
    window.location.reload();
    setUserInfoDialogOpen(false);
    setAddUserDialogOpen(false);
    
  };

  const handleUserCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    userId: number
  ) => {
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
      setEditedUser({ ...user }); // Set the editedUser state with the initial values from selectedUser
      setUserInfoDialogOpen(true);
    }
  };

  const handleUserClick = (userId: number) => {
    handleViewUserInfo(userId);
  };

  const handleDeleteUser = (userId: number) => {
    fetch(`/seat/admin/delete/${userId}`, { method: "POST" })
      .then((response) => {
        if (response.ok) {
          console.log(`User with ID ${userId} deleted successfully`);
          // Remove the deleted user from the state
          const updatedUsers = users.filter((user) => user.user_id !== userId);
          setUsers(updatedUsers);
        } else {
          console.log(`Failed to delete user with ID ${userId}`);
        }
      })
      .catch((error) => {
        console.log(`Error while deleting user with ID ${userId}`, error);
      });
  };

  const handleAddUser = () => {
    setAddUserDialogOpen(true); // Set the flag to open the dialog
  };

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleAddUsers = () => {
    const currentTime = new Date().toISOString();
    const loggedInUserId = sessionStorage.getItem("user_id");

    console.log("loggedInUserId:", loggedInUserId); // Check the value in the console

    const newUserModel = {
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      mobile_num: newUser.mobile_num,
      username: newUser.username,
      password: newUser.password,
      project_id: newUser.project_id,
      usertype_id: newUser.usertype_id,
      position_id: newUser.position_id,
      created_time: currentTime,
      created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };

    console.log("newUserModel:", newUserModel); // Check the newUserModel object in the console

    // Make the POST request to insert a new user
    fetch("/seat/admin/insert", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUserModel),
    })
      .then((response) => {
        if (response.ok) {
          console.log("User inserted successfully");
          setSnackbarMessage("User added successfully");
          setSnackbarOpen(true);
          setAddUserDialogOpen(false);
          // Refresh the page to reflect the changes
        } else if (response.status === 400) {
          response.json().then((data) => {
            console.log("Failed to insert user:", data.message);
            setSnackbarMessage(`Failed to add user: ${data.message}`);
            setSnackbarOpen(true);
          });
        } else {
          console.log("Failed to insert user");
          setSnackbarMessage("Failed to add user");
          setSnackbarOpen(true);
        }
      })
      .catch((error) => {
        console.log("Error while inserting user", error);
        setSnackbarMessage("Error while adding user");
        setSnackbarOpen(true);
      });
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

  const [searchText, setSearchText] = useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const filteredUsers = users
    .filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.last_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.username.toLowerCase().includes(searchText.toLowerCase())
    )
    .map((user) => {
      let formattedCreatedTime = "Invalid date";
      let formattedUpdatedTime = "Invalid date";

      if (
        user.created_time &&
        typeof user.created_time === "string" &&
        user.created_time.trim() !== ""
      ) {
        formattedCreatedTime = user.created_time;
      }

      if (
        user.updated_time &&
        typeof user.updated_time === "string" &&
        user.updated_time.trim() !== ""
      ) {
        formattedUpdatedTime = user.updated_time;
      }

      return {
        ...user,
        created_time: formattedCreatedTime,
        updated_time: formattedUpdatedTime,
      };
    });

  const indexOfLastUser = currentPage * perPage;
  const indexOfFirstUser = indexOfLastUser - perPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const [editMode, setEditMode] = useState(false);
  const [editedUser, setEditedUser] = useState<User | null>(null);
  const [editedProjects, setEditedProjects] = useState<number[]>([]); // State to store edited project_id values

  const handleEditUser = () => {
    setEditMode(true);
    setEditedUser(selectedUser);
  };

  const handleSaveUser = () => {
    if (!editedUser) {
      return;
    }

    // Prepare the updated user data
    const updatedUserModel: Partial<User> = {
      user_id: selectedUser?.user_id,
      usertype_id: editedUser?.usertype_id,
      position_id: editedUser?.position_id,
      project_id: editMode ? selectedProjects : editedUser?.project_id || [], // Use selectedProjects when in edit mode, otherwise use the old projects
      first_name: editedUser?.first_name || "",
      last_name: editedUser?.last_name || "",
      mobile_num: editedUser?.mobile_num || 0,
      username: editedUser?.username || "",
      password: editedUser?.password || "",
      updated_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };

    // Conditionally include the email field if it has been edited
    if (editedUser.email !== selectedUser?.email) {
      updatedUserModel.email = editedUser.email;
    }

    console.log("Data being updated:", updatedUserModel);

    // Make the PUT request to update the user
    fetch(`/seat/admin/update/${selectedUser?.user_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUserModel),
    })
      .then((response) => {
        if (response.ok) {
          console.log("User updated successfully");
          // Refresh the page to reflect the changes
          window.location.reload();
          // Alternatively, update the user in the user list if needed
        } else {
          response.text().then((errorMessage) => {
            console.log("Failed to update user:", errorMessage);
            window.location.reload();
            // Set the error message state
            setErrorMessage(errorMessage);
          });
        }
      })
      .catch((error) => {
        console.log("Error while updating user", error);
        window.location.reload();
      });
  };

  useEffect(() => {
    fetch("/seat/admin/showAllUser")
      .then((response) => response.json())
      .then((data) => {
        console.log("Users data:", data);
        setUsers(data);
      })
      .catch((error) => {
        console.log("Error while fetching users data:", error);
      });
  }, []);

  const [usertypes, setUserTypes] = useState<UserType[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [staffStatuses, setStaffStatuses] = useState<StaffStatus[]>([]);

  useEffect(() => {
    const fetchStaffStatuses = async () => {
      try {
        const response = await fetch("/seat/admin/showAllStaffStatus");
        const data = await response.json();
        setStaffStatuses(data);
      } catch (error) {
        console.error("Error fetching staff statuses:", error);
      }
    };

    fetchStaffStatuses();
  }, []);

  // Fetch position and usertype data from the server
  useEffect(() => {
    // Fetch positions
    fetch("/seat/admin/showAllPosition")
      .then((response) => response.json())
      .then((data) => {
        setPositions(data);
      })
      .catch((error) => {
        console.log("Error while fetching positions", error);
      });

    // Fetch usertypes
    fetch("/seat/admin/showAllUserType")
      .then((response) => response.json())
      .then((data) => {
        setUserTypes(data);
      })
      .catch((error) => {
        console.log("Error while fetching usertypes", error);
      });
  }, []);

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

  const sortedCurrentUsers = currentUsers.sort((a, b) => {
    const nameA = `${a.first_name} ${a.last_name}`.toLowerCase();
    const nameB = `${b.first_name} ${b.last_name}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });

  //sidebar
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
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

  const MachinePageHandleClick = () => {
    navigate("/machinetablePage");
  };

  const handleLogout = () => {
    // Clear any user-related data from the session/local storage
    sessionStorage.removeItem("user_id");

    // Redirect to the login page
    navigate("/");
  };

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
                <li className={styles["sidebar-title"]}></li>
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
                    className={styles["material-icons"]}
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
                <li>
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
                <li className={styles["active-page"]}>
                  <a
                    onClick={adminPageHandleClick}
                    className={styles["active"]}
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

      <div className="title">
        <Typography className="title-main" variant="h5" gutterBottom>
          USER INFORMATION
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
        <div className="search-bar-container">
          <input
            className="search-input"
            type="text"
            placeholder="Search"
            value={searchText}
            onChange={handleSearch}
          />
          <SearchIcon className="search-icon" />
        </div>
      </div>

      <TableContainer className="table-container" component={Paper}>
        <Table>
          <TableHead className="table-header">
            <TableRow>
              <TableCell></TableCell>
              <TableCell className="table-header">Name</TableCell>
              <TableCell className="table-header">Username</TableCell>
              <TableCell className="table-header">Email</TableCell>
              <TableCell className="table-header">Actions</TableCell>{" "}
              {/* Add this cell */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedCurrentUsers.map((user) => (
              <TableRow className="table-cell" key={user.user_id} hover>
                <TableCell
                  className="checkbox-btn"
                  padding="checkbox"
                ></TableCell>
                <TableCell>
                  <div className="user-info">
                    <PersonIcon fontSize="large" className="user-icon" />
                    <a
                      className="user-link"
                      href="#"
                      onClick={() => handleUserClick(user.user_id)}
                    >
                      {`${user.first_name} ${user.last_name}`}
                    </a>
                  </div>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleDeleteUser(user.user_id)}
                    color="primary"
                    aria-label="delete"
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
          count={Math.ceil(filteredUsers.length / perPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </Box>

      <Dialog
        open={userInfoDialogOpen}
        onClose={handleCloseDialog}
        fullScreen
        className="user-info-dialog"
      >
        <div className="user-info-page">
          <Typography variant="h5" className="user-info-title">
            {editMode ? "Edit Information" : "User Information"}
          </Typography>
          {selectedUser && (
            <div className="user-info-content">
              <strong className="user-info-label">Name:</strong>
              {editMode ? (
                <>
                  <div className="name-input">
                    <input
                      className="user-info-value"
                      placeholder="First Name | Last Name"
                      value={`${editedUser?.first_name || ""} | ${
                        editedUser?.last_name || ""
                      }`}
                      onChange={(e) => {
                        const [firstName, lastName] =
                          e.target.value.split(" | ");
                        setEditedUser((prevEditedUser: User | null) => ({
                          ...prevEditedUser!,
                          first_name: firstName || "",
                          last_name: lastName || "",
                        }));
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="user-info-value">
                  {`${editedUser?.first_name || ""} ${
                    editedUser?.last_name || ""
                  }`}
                </div>
              )}
              <strong className="user-info-label">Username:</strong>
              {editMode ? (
                <span className="user-info-value">
                  {editedUser?.username || ""}
                </span>
              ) : (
                <span className="user-info-value">{selectedUser.username}</span>
              )}
              <strong className="user-info-label">Email:</strong>
              {editMode ? (
                <input
                  className="user-info-value"
                  value={editedUser?.email || ""}
                  onChange={(e) =>
                    setEditedUser((prevEditedUser: User | null) => ({
                      ...prevEditedUser!,
                      email: e.target.value,
                    }))
                  }
                />
              ) : (
                <span className="user-info-value">{selectedUser.email}</span>
              )}
              <strong className="user-info-label">Contact:</strong>{" "}
              {editMode ? (
                <input
                  className="user-info-value"
                  value={editedUser?.mobile_num || ""}
                  onChange={(e) =>
                    setEditedUser((prevEditedUser: User | null) => ({
                      ...prevEditedUser!,
                      mobile_num: parseInt(e.target.value),
                    }))
                  }
                />
              ) : (
                <span className="user-info-value">
                  {selectedUser.mobile_num}
                </span>
              )}
              <strong className="user-info-label">Password:</strong>{" "}
              {editMode ? (
                <input
                  className="user-info-value"
                  type="password"
                  value={editedUser?.password || ""}
                  onChange={(e) =>
                    setEditedUser((prevEditedUser: User | null) => ({
                      ...prevEditedUser!,
                      password: e.target.value,
                    }))
                  }
                />
              ) : (
                <span className="user-info-value">
                  {selectedUser.password ? "********" : ""}
                </span>
              )}
              <strong className="user-info-label">UserType:</strong>{" "}
              {editMode ? (
                <Select
                  className="user-info-value"
                  value={editedUser?.usertype_id || ""} // Use the editedUser state value
                  onChange={(e) =>
                    setEditedUser((prevEditedUser: User | null) => ({
                      ...prevEditedUser!,
                      usertype_id: Number(e.target.value),
                    }))
                  }
                >
                  {usertypes.map((userType) => (
                    <MenuItem
                      key={userType.usertype_id}
                      value={userType.usertype_id}
                    >
                      {userType.usertype_name}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <span className="user-info-value">
                  {selectedUser.usertype_name}
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
                  {selectedUser?.project_name}
                </span>
              )}
              <strong className="user-info-label">Position:</strong>{" "}
              {editMode ? (
                <Select
                  className="user-info-value"
                  value={editedUser?.position_id || ""}
                  onChange={(e) =>
                    setEditedUser((prevEditedUser: User | null) => ({
                      ...prevEditedUser!,
                      position_id: Number(e.target.value),
                    }))
                  }
                >
                  {positions.map((position) => (
                    <MenuItem
                      key={position.position_id}
                      value={position.position_id}
                    >
                      {position.position_name}
                    </MenuItem>
                  ))}
                </Select>
              ) : (
                <span className="user-info-value">
                  {selectedUser.position_name}
                </span>
              )}
            </div>
          )}

          <div className="user-info-actions">
            {editMode ? (
              <Button
                onClick={handleSaveUser}
                color="primary"
                className="user-info-dialog-save-button"
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={handleEditUser}
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
        open={addUserDialogOpen || newUser.user_id !== 0}
        onClose={() => setNewUser({ ...newUser, user_id: 0 })}
        className="add-user-dialog"
      >
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
            onChange={(e) =>
              setNewUser({ ...newUser, first_name: e.target.value })
            }
            required
          />
          <TextField
            margin="dense"
            label="Last Name"
            type="text"
            fullWidth
            value={newUser.last_name}
            onChange={(e) =>
              setNewUser({ ...newUser, last_name: e.target.value })
            }
            required
          />
          <TextField
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            value={newUser.username}
            onChange={(e) =>
              setNewUser({ ...newUser, username: e.target.value })
            }
            required
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <TextField
            margin="dense"
            label="Contact"
            type="number"
            fullWidth
            value={newUser.mobile_num}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                mobile_num: parseInt(e.target.value, 10),
              })
            }
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            required
          />

          <Typography variant="subtitle1" gutterBottom>
            Position
          </Typography>
          <Select
            margin="dense"
            value={newUser.position_id}
            onChange={(e) =>
              setNewUser({ ...newUser, position_id: Number(e.target.value) })
            }
            fullWidth
            required
          >
            {positions.map((position) => (
              <MenuItem key={position.position_id} value={position.position_id}>
                {position.position_name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="subtitle1" gutterBottom>
            Project
          </Typography>
          <Select
            multiple
            margin="dense"
            value={newUser.project_id}
            onChange={(e: any) => {
              const target = e.target as HTMLSelectElement;
              const selectedOptions = Array.from(target.selectedOptions);
              const selectedValues: number[] = selectedOptions.map((option) =>
                Number(option.value)
              );
              setNewUser({ ...newUser, project_id: selectedValues });
            }}
            fullWidth
            required
          >
            {projects.map((project) => (
              <MenuItem key={project.project_id} value={project.project_id}>
                {project.project_name}
              </MenuItem>
            ))}
          </Select>

          <Typography variant="subtitle1" gutterBottom>
            UserType
          </Typography>
          <Select
            margin="dense"
            value={newUser.usertype_id}
            onChange={(e) =>
              setNewUser({ ...newUser, usertype_id: Number(e.target.value) })
            }
            fullWidth
            required
          >
            {usertypes.map((usertype) => (
              <MenuItem key={usertype.usertype_id} value={usertype.usertype_id}>
                {usertype.usertype_name}
              </MenuItem>
            ))}
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

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AdminMembersPage;
