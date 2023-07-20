import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFaceSmile, faChartBar, faUsers, faPlus, faPowerOff, faEdit, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
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
} from '@mui/material';

import './projectPage.css';

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


function ProjectPage() {

  // State variables to handle form inputs
  const [projectName, setProjectName] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  // Add state variables for the additional data fields (if needed)

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input Value:', e.target.value);
    setProjectName(e.target.value);
  };
  

  useEffect(() => {
    // Retrieve the logged-in user ID from the session storage
    const user_id = sessionStorage.getItem('user_id');
    setLoggedInUserId(user_id ? parseInt(user_id) : null);
  }, []);

  // Add event handlers for the additional data fields (if needed)

  const [colors, setColors] = useState<ColorModel[]>([]);

  useEffect(() => {
    fetchColors();
  }, []);

  const fetchColors = async () => {
    try {
      const response = await fetch('http://localhost:8080/project/allColor');
      if (response.ok) {
        const colorsData = await response.json();
        setColors(colorsData);
      } else {
        console.error('Failed to fetch colors');
      }
    } catch (error) {
      console.error('Error occurred while fetching colors:', error);
    }
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

  const projectPageHandleClick = () => {
    navigate('/ProjectPage');
  };

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Function to handle form submission
  // ... (previous code)

// Function to handle form submission
const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Retrieve the user ID from session storage
  // Create a new project object to send to the backend
  const newProject: Project = {
    project_name: projectName,
    color_id: selectedColorId,
    created_by: loggedInUserId ? Number(loggedInUserId) : 0,
  };

  console.log('New Project:', newProject);
  try {
    // Make a request to the backend to add the new project
    const response = await fetch('http://localhost:8080/project/insertNewProject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newProject),
    });

    if (response.ok) {
      // Project created successfully
      // Perform any additional actions or show a success message if needed
      console.log('Project created successfully');
      // Reset form inputs after successful project creation
      setProjectName('');
      setSelectedColorId(0); // Reset selectedColorId to the default value
      window.location.reload(); // Reload the page after successful project creation
    } else {
      // Failed to create project
      // Handle the error or show an error message if needed
      console.error('Failed to create project');
    }
  } catch (error) {
    console.error('Error occurred during project creation:', error);
  }
};

// ... (remaining code)


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
      const response = await fetch('http://localhost:8080/project/showAllProject');
      if (response.ok) {
        const projectsData = await response.json();
        setProjects(projectsData);

      } else {
        console.error('Failed to fetch projects');
      }
    } catch (error) {
      console.error('Error occurred while fetching projects:', error);
    }
  };


  const navigate = useNavigate();

  const getColorName = (colorId: number) => {
    const color = colors.find((c) => c.color_id === colorId);
    return color ? color.color_name : 'Unknown Color';
  };


  const projectsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  // Function to get the projects for the current page
  const getCurrentPageProjects = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return projects.slice(startIndex, endIndex);
  };



  
  return (
    <body className="backg">
    <div>
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
      {/* Project form */}
      <form className="form0" onSubmit={handleSubmit}>
  <div className="formG">
    <label className="projectlabel" htmlFor="projectName">Project Name:</label>
    <input
      type="text"
      className="projectinput"
      id="projectName"
      name="projectName"
      value={projectName}
      onChange={handleProjectNameChange}
      required
    />
  </div>
  <div className="formG">
    <label  htmlFor="colorId">Color:</label>
    <select className="projectselect" id="colorId" name="colorId" value={selectedColorId} onChange={handleColorIdChange} required>
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
  </button><br></br>
</form>
<TableContainer component={Paper}>
        <Table>
          <TableHead className="Thead">
            <TableRow>
              <TableCell className="Tcell"></TableCell>
              <TableCell className="Tcell">Project Name</TableCell>
              <TableCell className="Tcell">Color</TableCell>
              <TableCell className="Tcell">Created By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {getCurrentPageProjects().map((project) => (
              <TableRow key={project.project_id} hover>
                <TableCell padding="checkbox">
                  {/* Add your checkbox logic here if needed */}
                </TableCell>
                <TableCell>
                  {/* You can use a link to navigate to a specific project if needed */}
                  <a>{project.project_name}</a>
                </TableCell>
                <TableCell className="Tcell">{getColorName(project.color_id)}</TableCell>
                <TableCell className="Tcell">{project.created_by}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        count={Math.ceil(projects.length / projectsPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        className="pagination"
      />
  </div>
  
  </body>
  );
}

export default ProjectPage;
