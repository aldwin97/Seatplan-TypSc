import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import styles from "../dashboard_component/dashboardPage.module.css";
import MuiAlert from "@mui/material/Alert";
import { Avatar} from '@mui/material';
import axios from 'axios';
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
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import {
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
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
  const [UserData, setUserData] = useState<UserData | null>(null);
  const [projectName, setProjectName] = useState("");
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input Value:", e.target.value);
    setProjectName(e.target.value);
  };
  useEffect(() => {
    const fetchUserPicture = async () => {
      try {
        const user_id = window.sessionStorage.getItem('user_id');
        const pictureResponse = await axios.get(`http://localhost:8080/profile/userPicture/${user_id}`, {
          responseType: 'arraybuffer',
        });

        const base64Data = btoa(
          new Uint8Array(pictureResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        const pictureDataUrl = `data:${pictureResponse.headers['content-type'].toLowerCase()};base64,${base64Data}`;
        setUserPicture(pictureDataUrl);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchUserPicture();
  }, []);

  useEffect(() => {
    const user_id = window.sessionStorage.getItem('user_id');

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/dashboard/showLogedUserInfo/${user_id}`);

        const responseData: UserData = response.data[0];
        setUserData(responseData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
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
      const response = await fetch("http://localhost:8080/project/allColor");
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
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('usertype_id');


    // Redirect to the login page
    navigate('/');
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
        "http://localhost:8080/project/insertNewProject",
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

  const [selectedColorId, setSelectedColorId] = useState(0);

  // Function to handle changes in the color select menu
  const handleColorIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColorId(parseInt(e.target.value));
  };

  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/project/showAllProject"
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

  const projectsPerPage = 5;
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
              <div className="accordion-menu-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className={styles['userbg']}>
                      <div className={styles['userpr']}>
                      {userPicture ? (
      <Avatar src={userPicture} alt="User" />
    ) : (
      <img
      src={defaulImage}
      alt="Profile Default"
      className={styles.defaultImage}// Add any additional styles here
      />
    )}
                      </div>
                    </div>
                    {UserData ? (
                      <div className={styles['usern']}>
                        {UserData.first_name}  {UserData.last_name} 
                          <div className={styles['userp']}>{UserData.position_name}</div>
                      </div>
          
                    ) : (
                      <div></div>
                    )}
                  </div>
                <li className={styles["sidebar-title"]}>Apps</li>
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
      <div className="backg">
        <div>
          {/* Project form */}
          <form className="form0" onSubmit={handleSubmit}>
            <div className="formG">
              <label className="projectlabel" htmlFor="projectName">
                Project Name:
              </label>
              <input
                type="text"
                className="projectinput"
                id="projectName"
                name="projectName"
                value={projectName}
                onChange={handleProjectNameChange}
                placeholder="Enter Project Name"
                required
              />
            </div>
            <Snackbar
              open={snackbarOpen}
              autoHideDuration={5000}
              onClose={closeSnackbar}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              style={{ top: "120px", right: "550px" }}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={closeSnackbar}
                severity={snackbarSeverity}
              >
                {snackbarMessage}
              </MuiAlert>
            </Snackbar>
            <div className="formG">
              <label className="colorlabel" htmlFor="colorId">
                Color:
              </label>
              <select
                className="projectselect"
                id="colorId"
                name="colorId"
                value={selectedColorId}
                onChange={handleColorIdChange}
                required
              >
                <option value={0}>Select a color</option>
                {colors.map((color) => (
                  <option key={color.color_id} value={color.color_id}>
                    {color.color_name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="submitButton">
              <FontAwesomeIcon icon={faPlus} className="icon" />
              Add Project
            </button>
            <br></br>
          </form>

          <div className={`${styles.projectDetails} projectDetails`}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead className={styles.Thead}>
                  <TableRow>
                    <TableCell className={`${styles.Tcell} Thead`}></TableCell>
                    <TableCell className={`${styles.Tcell} Thead`}>
                      Project Name
                    </TableCell>
                    <TableCell className={`${styles.Tcell} Thead`}>
                      Color
                    </TableCell>
                    <TableCell className={`${styles.Tcell} Thead`}>
                      Created By
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getCurrentPageProjects().map((project) => (
                    <TableRow key={project.project_id} hover>
                      <TableCell padding="checkbox">
                        {/* Add your checkbox logic here if needed */}
                      </TableCell>
                      <TableCell className={`${styles.Tcell} Tcell`}>
                        {/* You can use a link to navigate to a specific project if needed */}
                        <a>{project.project_name}</a>
                      </TableCell>
                      <TableCell className={`${styles.Tcell} Tcell`}>
                        {getColorName(project.color_id)}
                      </TableCell>
                      <TableCell className="Tcell">
                        {project.created_by}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Pagination
            count={Math.ceil(projects.length / projectsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            className="pagination"
          />
        </div>
      </div>
    </body>
  );
}

export default ProjectPage;
