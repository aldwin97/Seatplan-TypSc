import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from 'react-icons/fa'; // Import the logout icon
import { MdCancel } from 'react-icons/md'; // Import the cancel icon
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import styles from "../dashboard_component/dashboardPage.module.css";
import MuiAlert from "@mui/material/Alert";
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
  Search,
} from "@mui/icons-material";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
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

import "./projectPage.css";

interface ColorModel {
  color_id: number;
  color_name: string;
  color_code: string;
}

interface Project {
  project_id?: number; // Marking it as optional with `?`
  project_name: string;
  color_id: number;
  created_by: number;
}
interface UserData {
  first_name: string;
  last_name: string;
  position_name: string;
}
function ProjectPage() {
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [addProjectDialogOpen, setAddProjectDialogOpen] = useState(false);
  const [UserData, setUserData] = useState<UserData | null>(null);
  const [projectName, setProjectName] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [perPage, setPerPage] = useState(10);
  const perPageOptions = [5, 10, 20];
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isDialogOpen, setDialogOpen] = useState(false); // State for the dialog

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input Value:", e.target.value);
    setProjectName(e.target.value);
  };
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "/seat/project/showAllProject"
        );
        if (response.ok) {
          const projectsData = await response.json();
          setProjects(projectsData);

          // Calculate totalPages based on the number of projects and perPage
          const calculatedTotalPages = Math.ceil(projectsData.length / perPage);
          setTotalPages(calculatedTotalPages);
        } else {
          console.error("Failed to fetch projects");
        }
      } catch (error) {
        console.error("Error occurred while fetching projects:", error);
      }
    };

    fetchProjects();
  }, [perPage]);

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
    const user_id = sessionStorage.getItem("user_id");
    setLoggedInUserId(user_id ? parseInt(user_id) : null);
  }, []);

  const [colors, setColors] = useState<ColorModel[]>([]);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch("/seat/project/allColor");
      if (response.ok) {
        const colorsData = await response.json();
        setColors(colorsData);
      } else {
        console.error("Failed to fetch colors");
      }
    } catch (error) {
      console.error("Error occurred while fetching colors:", error);
    }
  };

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  //sidebar
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
    sessionStorage.removeItem("usertype_id");

    // Redirect to the login page
    navigate("/");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedColorId === 0) {
      openSnackbar("Please select a color", "error");
      return;
    }

    const newProject: Project = {
      project_name: projectName,
      color_id: selectedColorId,
      created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };

    console.log("New Project:", newProject);
    try {
      const response = await fetch(
        "/seat/project/insertNewProject",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        }
      );

      if (response.ok) {
        console.log("Project created successfully!");
        openSnackbar("Project created successfully!", "success");
        setProjectName("");
        setSelectedColorId(0); // Reset selectedColorId to the default value
        fetchProjects(); // Fetch updated projects
      } else {
        // Failed to create project
        // Handle the error or show an error message if needed
        console.error("Project Name already exist!");
        openSnackbar("Project Name already exist!", "error"); // Show error snackbar
      }
    } catch (error) {
      console.error("Error occurred during project creation:", error);
      openSnackbar("An error occurred", "error"); // Show error snackbar
    }
  };

  const [selectedColorId, setSelectedColorId] = useState<number>(0); // Initialize with a number type

  const handleColorIdChange = (e: SelectChangeEvent<number>) => {
    const value =
      typeof e.target.value === "string"
        ? parseInt(e.target.value, 10)
        : e.target.value;
    setSelectedColorId(value);
  };

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "/seat/project/showAllProject"
      );
      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);
      } else {
        console.error("Failed to fetch projects");
      }
    } catch (error) {
      console.error("Error occurred while fetching projects:", error);
    }
  };

  const navigate = useNavigate();

  const getColorName = (colorId: number) => {
    const color = colors.find((c) => c.color_id === colorId);
    return color ? color.color_name : "Unknown Color";
  };

  const projectsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  // Function to get the projects for the current page
  const getCurrentPageProjects = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return projects.slice(startIndex, endIndex);
  };

  // Define these functions within your component
  const openSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const closeSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <body>
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
                <li className={styles["active-page"]}>
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
                <li>
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
                        <span>Okay</span> <FaSignOutAlt className={styles.buttonIcon} />
                      </button>
                      <button
                        className={styles.popupButtonNo}
                        onClick={() => setShowLogoutConfirmation(false)}
                      >
                        <span>Cancel</span> <MdCancel className={styles.buttonIcon} />
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
      <div className="container2">
        <div className="title">
          <Typography className="title-main" variant="h5" gutterBottom>
            PROJECT
          </Typography>

          {/* Button to open the dialog */}

          <Button
            variant="outlined"
            className="add-user-button"
            color="primary"
            onClick={handleOpenDialog}
          >
            Add Project
          </Button>
        </div>
        <TableContainer className="table-container" component={Paper}>
          <Table>
            <TableHead className="table-header">
              <TableRow>
                <TableCell></TableCell>
                <TableCell className="table-header">Project Name</TableCell>
                <TableCell className="table-header">Color</TableCell>
                <TableCell className="table-header">Created by</TableCell>

                {/* Add this cell */}
              </TableRow>
            </TableHead>

            <TableBody>
              {getCurrentPageProjects().map((project) => (
                <TableRow className="table-cell" key={project.project_id} hover>
                  <TableCell
                    className="checkbox-btn"
                    padding="checkbox"
                  ></TableCell>
                  <TableCell>{project.project_name}</TableCell>
                  <TableCell> {getColorName(project.color_id)}</TableCell>
                  <TableCell>{project.created_by}</TableCell>
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
        ></Box>

        <div className="backg">
          <div>
            {/* Project creation dialog */}
            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
              <DialogTitle>Add Project</DialogTitle>
              <DialogContent>
                <form onSubmit={handleSubmit}>
                  <div className="formG">
                    <label className="projectlabel" htmlFor="projectName">
                      Project Name:
                    </label>
                    <TextField
                      type="text"
                      className="projectinput"
                      id="projectName"
                      name="projectName"
                      value={projectName}
                      onChange={handleProjectNameChange}
                      placeholder="Enter Project Name"
                      required
                      fullWidth
                    />
                  </div>
                  <div className="formG">
                    <label className="colorlabel" htmlFor="colorId">
                      Color:
                    </label>
                    <Select
                      className="projectselect"
                      id="colorId"
                      name="colorId"
                      value={selectedColorId}
                      onChange={handleColorIdChange}
                      required
                      fullWidth
                    >
                      <MenuItem value={0}>Select a color</MenuItem>
                      {colors.map((color) => (
                        <MenuItem key={color.color_id} value={color.color_id}>
                          {color.color_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                  <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                      Cancel
                    </Button>
                    <Button type="submit" color="primary">
                      Add
                    </Button>
                  </DialogActions>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <Box
          className="pagination-container"
          display="flex"
          justifyContent="center"
          marginTop={2}
        >
          <Pagination
            count={totalPages} // Use the calculated totalPages
            page={currentPage}
            onChange={handlePageChange}
          />
        </Box>
      </div>
    </body>
  );
}

export default ProjectPage;
