import React, { useState, useEffect, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaEye, FaSearch, FaTrash } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faSmile } from '@fortawesome/free-solid-svg-icons';
import styles from './adminPage.module.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import logoImage from '../assets/LOGO.png';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: string;
  contact: string;
  password: string;
}

interface NewUser extends Omit<User, 'id'> {
  firstName: string;
  lastName: string;
  position: string;
  usertype: string;
}

const AdminPage: React.FC = () => {
  const initialUserState: NewUser = {
    firstName: '',
    lastName: '',
    name: '', // Add the 'name' property here
    username: '',
    email: '',
    address: '',
    contact: '',
    password: '',
    position: '',
    usertype: '',
  };

  const [users, setUsers] = useState<User[]>([
   
    // Add more user objects as needed
  ]);

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>(initialUserState);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [viewUser, setViewUser] = useState<User | null>(null); // New state to store the user being viewed

  const navigate = useNavigate();

  const dashboardPageHandleClick = () => {
    navigate('/DashboardPage');
  };

  const logInPageHandleClick = () => {
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSave = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (editUser) {
      setUsers((prevUsers) => {
        return prevUsers.map((user) => {
          if (user.id === editUser.id) {
            return {
              ...user,
              name: `${newUser.firstName} ${newUser.lastName}`,
              username: newUser.username,
              email: newUser.email,
              address: newUser.address,
              contact: newUser.contact,
              password: newUser.password,
            };
          }
          return user;
        });
      });
    } else {
      const newUserId = users.length + 1;

      const newUserObj: User = {
        id: newUserId,
        name: `${newUser.firstName} ${newUser.lastName}`,
        username: newUser.username,
        email: newUser.email,
        address: newUser.address,
        contact: newUser.contact,
        password: newUser.password,
      };

      setUsers((prevUsers) => [...prevUsers, newUserObj]);
    }

    setNewUser(initialUserState);
    setEditUser(null);
    setShowPopup(false);
  };

  const handleCancel = () => {
    setNewUser(initialUserState);
    setEditUser(null);
    setShowPopup(false);
  };

  const handleEditUser = (user: User) => {
    setEditUser(user);
    setNewUser(prevUser => ({
      ...prevUser,
      name: user.name,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1],
      username: user.username,
      email: user.email,
      address: user.address,
      contact: user.contact,
      password: user.password,
      position: '',
      usertype: '',
    }));
    
    setShowPopup(true);
  };

  useEffect(() => {
    const handleResize = () => {
      const addUserButton = document.getElementById('addUserButton');
      if (addUserButton) {
        if (window.innerWidth <= 600) {
          addUserButton.textContent = 'Add';
        } else {
          addUserButton.textContent = 'Add New User';
        }
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const handlePrint = () => {
    // Logic to handle printing
    // ...
  };
  const tableRows = users.map((user) => [
    user.id.toString(),
    user.name,
    user.username,
    user.email,
    user.address,
    user.contact,
    user.password,
  ]);
  
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
  
    // Add the logo image
    const logoWidth = 15; // Adjust the width of the logo
    const logoHeight = 15; // Adjust the height of the logo
    const logoX = 5; // Adjust the X position of the logo
    const logoY = 5; // Adjust the Y position of the logo
    doc.addImage(logoImage, 'PNG', logoX, logoY, logoWidth, logoHeight);
  
    // Get the current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleString();
  
    doc.text(`Members List (${formattedDate})`, logoX + logoWidth + 10, logoY + logoHeight / 2);
  
    // @ts-ignore
    doc.autoTable({
      head: [['ID', 'Name', 'Username', 'Email', 'Address', 'Contact', 'Password']],
      body: tableRows,
      startY: logoY + logoHeight + 10,
    });
  
    doc.save('members_list.pdf');
  };
  const handleDeleteUser = (id: number) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };
  const handleViewUser = (user: User) => {
    setViewUser(user);
  };

  const handleCloseUser = () => {
    setViewUser(null);
  };
  
  return (
    <div className={styles.container}>
      <div className={styles.searchBar}>
        <input type="text" placeholder="Search" className={styles.searchInput} />
        <button className={styles.searchButton} type="submit">
          <FaSearch />
        </button>
      </div>
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
          <button className={styles.sub}>
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            Members
          </button>
          <button className={styles.sub}>
            <FontAwesomeIcon icon={faProjectDiagram} className={styles.icon} />
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
            <FontAwesomeIcon icon={faSmile} className={styles.icon} />
            Profile
          </button>
          <button onClick={logInPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon icon={faPowerOff} className={styles.icon} />
            Logout
          </button>
        </div>
      )}

      <button className={styles.notif}>
        <FontAwesomeIcon icon={faBell} />
      </button>
      <div className={styles.container2}>
        <div className={styles.form2}>
          <div className={styles.text}>MEMBERS LIST</div>
          <div className={styles.actions}>
            <button className={styles.actionButton} onClick={handleExportPDF}>
              PDF
            </button>
            <button type="button" id="addUserButton" className={styles.actionButton} onClick={() => setShowPopup(true)}>
              Add New User
            </button>
      
          </div>

          <div className={styles.tableContainer}>
            <div className={styles.scrollable}>
            <div className={styles.tableResponsive}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>Password</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.address}</td>
                      <td>{user.contact}</td>
                      <td>{user.password}</td>
                      <td>
                      <FaEye className={styles.viewIcon} onClick={() => handleViewUser(user)} /> {/* Handle view action */}
                        <FaEdit className={styles.editIcon} onClick={() => handleEditUser(user)} />
                        <FaTrash className={styles.deleteIcon} onClick={() => handleDeleteUser(user.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </div>
          </div>
        </div>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>{editUser ? 'Edit User' : 'Add New User'}</h2>
            <div className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={newUser.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={newUser.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={newUser.username}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={newUser.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="contact">Contact</label>
                <input
                  type="text"
                  id="contact"
                  name="contact"
                  value={newUser.contact}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newUser.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.buttonContainer}>
                <button className={styles.buttonacts} onClick={handleSave}>
                  Save
                </button>
                <button className={styles.buttonacts} onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

{/* User information popup */}
{viewUser && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>User Information</h2>
            <div className={styles.form}>
              {/* Display user information here */}
              <p><strong>Name:</strong> {viewUser.name}</p>
              <p><strong>Username:</strong> {viewUser.username}</p>
              <p><strong>Email:</strong> {viewUser.email}</p>
              <p><strong>Address:</strong> {viewUser.address}</p>
              <p><strong>Contact:</strong> {viewUser.contact}</p>
              {/* You can add more user information as needed */}
              <div className={styles.buttonContainer}>
              <button className={styles.buttonacts} onClick={handleCloseUser}>
  Close
</button>
              </div>
            </div>
          </div>
        </div>
      )}



    </div>
  );
};

export default AdminPage;
