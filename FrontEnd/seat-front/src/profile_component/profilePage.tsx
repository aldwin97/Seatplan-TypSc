import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profilePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';

function ProfilePage() {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
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

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handlePersonalSaveChanges = () => {
    // Perform actions to save the changes
    // This can include sending the form data to the server or updating the state
    console.log('Saving changes...');
  };

  const handlePersonalCancelChanges = () => {
    // Reset the form fields to their initial values or clear them
    // Perform any other necessary actions when canceling changes
    console.log('Canceling changes...');
  };

  const handleAccountSaveChanges = () => {
    if (newPassword !== confirmPassword) {
      setPasswordsMatch(false);
      return; // Stop further execution
    }

    // Reset the error state
    setPasswordsMatch(true);

    // Perform actions to save the changes
    // This can include sending the form data to the server or updating the state
    console.log('Saving changes...');
  };

  const handleAccountCancelChanges = () => {
    // Reset the form fields to their initial values or clear them
    setNewPassword('');
    setConfirmPassword('');

    // Perform any other actions needed when canceling changes
    console.log('Canceling changes...');
  };

  return (
    <>
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
          <button onClick={seatplanPageHandleClick} className={styles.sub}>
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
            <FontAwesomeIcon icon={faFaceSmile} className={styles.icon} />
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
    </div>


    <div className = {styles.prof}>
      <form className={styles.form1}>

        <h1>PERSONAL INFORMATION</h1>
        <div className={styles['input-group']}>
          <input required
          type="text"
          name = "firstName"
          autoComplete="off"
          className={styles.input}
        />
        <label className= {styles['user-label']}>First Name</label>
        </div>

        <div className={styles['input-group']}>
          <input required
          type="text"
          name = "lastName"
          autoComplete="off"
          className={styles.input}
        />
        <label className= {styles['user-label']}>Last Name</label>
        </div>

        <div className={styles['input-group']}>
          <input required
          type="text"
          name = "emailAddress"
          autoComplete="off"
          className={styles.input}
        />
        <label className= {styles['user-label']}>Email Address</label>
        </div>

        <div className={styles['input-group']}>
          <input required
          type="number"
          name = "contactNumber"
          autoComplete="off"
          className={styles.input}
        />
        <label className= {styles['user-label']}>Contact Number</label>
        </div>

        <div className={styles['button-group']}>
            <button type="button" className={styles.saveButton} onClick={handlePersonalSaveChanges}>
              Save Changes
            </button>
            <button type="button" className={styles.cancelButton} onClick={handlePersonalCancelChanges}>
              Cancel
            </button>
          </div>



        <h2>ACCOUNT SETTINGS</h2>
        <div className={styles['input-group']}>
            <input
              required
              type="text"
              name="username"
              autoComplete="off"
              className={styles.input}
            />
            <label className={styles['user-label']}>Username</label>
        </div>

        <div className={styles['input-group']}>
              <input
                required
                type={showOldPassword ? 'text' : 'password'}
                name="oldPassword"
                autoComplete="off"
                className={styles.input}
              />
              <label className={styles['user-label']}>Old Password</label>
              <span
                className={`${styles['toggle-password']} ${showOldPassword ? styles.active : ''}`}
                onClick={toggleOldPasswordVisibility}
              >
                {showOldPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className={styles['input-group']}>
              <input
                required
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                autoComplete="off"
                className={styles.input}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <label className={styles['user-label']}>New Password</label>
              <span
                className={`${styles['toggle-password']} ${showNewPassword ? styles.active : ''}`}
                onClick={toggleNewPasswordVisibility}
              >
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            <div className={styles['input-group']}>
              <input
                required
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                autoComplete="off"
                className={styles.input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label className={styles['user-label']}>Confirm Password</label>
              <span
                className={`${styles['toggle-password']} ${showConfirmPassword ? styles.active : ''}`}
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>

            {!passwordsMatch && <p className={styles.error}>Passwords do not match.</p>}

            <div className={styles['button-group']}>
              <button type="button" className={styles.saveButton} onClick={handleAccountSaveChanges}>
                Save Changes
              </button>
              <button type="button" className={styles.cancelButton} onClick={handleAccountCancelChanges}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </body>
    </>
  );

}

export default ProfilePage;
