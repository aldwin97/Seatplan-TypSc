import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFaceSmile, faChartBar, faUsers, faPlus, faPowerOff, faEdit, faProjectDiagram } from '@fortawesome/free-solid-svg-icons';
import styles from './projectPage.module.css';

interface ColorModel {
  color_id: number;
  color_name: string;
  color_code: string;
}

interface Project {
  project_id?: number;
  project_name: string;
  color_id: number;
  created_by: number;
}


function ProjectPage() {
  const navigate = useNavigate();

  // State variables to handle form inputs
  const [projectName, setProjectName] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState<number | null>(null);

  // Add state variables for the additional data fields (if needed)

  const handleProjectNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Retrieve the user ID from session storage
    // Create a new project object to send to the backend
    const newProject: Project = {
      project_name: '',
      color_id: selectedColorId,
      created_by: loggedInUserId ? Number(loggedInUserId) : 0,
    };
    console.log('New Project:', newProject);
    try {
      // Make a request to the backend to add the new project
      const response = await fetch('http://localhost:8080/project/add', {
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
      } else {
        // Failed to create project
        // Handle the error or show an error message if needed
        console.error('Failed to create project');
      }
    } catch (error) {
      console.error('Error occurred during project creation:', error);
    }
  };

  const [selectedColorId, setSelectedColorId] = useState(0);

  // Function to handle changes in the color select menu
  const handleColorIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedColorId(parseInt(e.target.value));
  };


  return (
    <body className={styles.backg}>
    <div className={styles.container}>
      <button className={`${styles.burgerButton} ${isDropdownOpen ? styles.open : ''}`} onClick={toggleDropdown}>
        <div className={styles.burgerIcon}></div>
        <div className={styles.burgerIcon}></div>
        <div className={styles.burgerIcon}></div>
      </button>

      {isDropdownOpen && (
        <div className={`${styles.dropdownMenu} ${styles.dropdownRows}`}>
          <button onClick={dashboardPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon icon={faChartBar} className={styles.icon} />
            Dashboard
          </button>
          <button onClick={adminPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
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

      <button className={`${styles.profile} ${isProfileDropdownOpen ? styles.open2 : ''}`} onClick={toggleProfileDropdown}>
        <FontAwesomeIcon icon={faUser} />
      </button>

      {isProfileDropdownOpen && (
        <div className={styles.dropdownMenu2}>
          <button className={styles.sub}>
            <FontAwesomeIcon icon={faFaceSmile} className={styles.icon} />
            Profile
          </button>
          <button onClick={logInPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon icon={faPowerOff} className={styles.icon} />
            Logout
          </button>
        </div>
      )}

      {/* Project form */}
      <form className={styles.form} onSubmit={handleSubmit}>
  <div className={styles.formGroup}>
    <label htmlFor="projectName">Project Name:</label>
    <input
      type="text"
      id="projectName"
      name="projectName"
      value={projectName}
      onChange={handleProjectNameChange}
      required
    />
  </div>
  <div className={styles.formGroup}>
    <label htmlFor="colorId">Color:</label>
    <select id="colorId" name="colorId" value={selectedColorId} onChange={handleColorIdChange} required>
      <option value={0}>Select a color</option>
      {colors.map((color) => (
        <option key={color.color_id} value={color.color_id}>
          {color.color_name}
        </option>
      ))}
    </select>
  </div>
  <button type="submit" className={styles.submitButton}>
    <FontAwesomeIcon icon={faPlus} className={styles.icon} />
    Add Project
  </button>
</form>
  </div>
  </body>
  );
}

export default ProjectPage;
