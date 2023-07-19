import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './profilePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUser, faBell, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import profileBackg from './assets/profileBackg.jpg'; 
import ManageAccountsSharpIcon from '@mui/icons-material/ManageAccountsSharp';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';



const LogInPage: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editPersonalMode, setPersonalEditMode] = useState(false);
  const [editAccountMode, setAccountEditMode] = useState(false);


  const navigate = useNavigate();

  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShow) => !prevShow);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShow) => !prevShow);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };

  const logInPageHandleClick = (): void => {
    navigate('/');
  };

  const handlePersonalSaveChanges = () => {
    // Your save changes logic goes here
    setPersonalEditMode(false); // Once changes are saved, exit edit mode
  };

  const handlePersonalCancelChanges = () => {
    // Your cancel changes logic goes here
    setPersonalEditMode(false); // Exit edit mode when changes are canceled
  };

  const handlePersonalEditClick = () => {
    setPersonalEditMode(true); // Enable edit mode when the user clicks the "Edit" button
  };


  const handleAccountSaveChanges = (): void => {
    // Perform actions to save the changes
    // This can include sending the form data to the server or updating the state
    setAccountEditMode(false); // Once changes are saved, exit edit mode
  };

  const handleAccountCancelChanges = (): void => {
    // Reset the form fields to their initial values or clear them
    // Perform any other necessary actions when canceling changes
    setAccountEditMode(false); // Exit edit mode when changes are canceled
  };

  const handleAccountEditClick = () => {
    setAccountEditMode(true); // Enable edit mode when the user clicks the "Edit" button
  };




  





  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const toggleProfileDropdown = (): void => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <body className={styles.backg}>
      
      {/* Cards */}
      <form className={styles.form1}>
      <div className={styles.profileSum}>
        <div className={styles.cover}>
      <img src={profileBackg} />
        </div>
      </div>
      <div className={styles.set}>














        <div className={styles.personal}>
          <div className={styles.line}></div>
      <h1>Personal Information</h1>
      
        <div className={styles['name-group']}>

          <input
            required
            type="text"
            name="FirstName"
            autoComplete="off"
            className={styles.nameInput}
            readOnly={!editPersonalMode}
          />

          <label className={styles['name-label']}>First Name</label>
          
        </div>


        <div className={styles['name-group']}>
          <input
            required
            type="text"
            name="LastName"
            autoComplete="off"
            className={styles.nameInput}
            readOnly={!editPersonalMode}
          />
          <label className={styles['name-label']}>Last Name</label>
        </div>
        

        <div className={styles['input-group']}>
          <input
            required
            type="text"
            name="Email"
            autoComplete="off"
            className={styles.input}
            readOnly={!editPersonalMode}
          />
          <label className={styles['user-label']}>Email Address</label>
        </div>

        <div className={styles['input-group']}>
          <input
            required
            type="text"
            name="ContactNumber"
            autoComplete="off"
            className={styles.input}
            readOnly={!editPersonalMode}
          />
          <label className={styles['user-label']}>Contact Number</label>
        </div>
       
        {editPersonalMode ? (
        <div className={styles['personal-button']}>
          <button type="button" className={styles.saveButton} onClick={handlePersonalSaveChanges}>
            Save Changes
          </button>
          <button type="button" className={styles.cancelButton} onClick={handlePersonalCancelChanges}>
            Cancel
          </button>
        </div>
      ) : (
        <Tooltip title="Edit" placement="top" arrow className={styles.editPersonalButton}>
          <IconButton onClick={handlePersonalEditClick}>
            <ManageAccountsSharpIcon />
          </IconButton>
        </Tooltip>
      )}
      </div>





















      <div className={styles.accountS}>
      <div className={styles.line}></div>
      <h1>Account Settings</h1>

      <div className={styles['input-group']}>
        <input
          required
          type="text"
          name="username"
          autoComplete="off"
          className={styles.input}
          readOnly={true} // Set to true to disable the 
          // value={username} // Set the value with the retrieved username from the database 
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
          readOnly={!editAccountMode}
        />
        <label className={styles['user-label']}>Old Password</label>
        {editAccountMode && (
          <span
            className={`${styles['toggle-password']} ${showOldPassword ? styles.active : ''}`}
            onClick={toggleOldPasswordVisibility}
          >
            {showOldPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        )}
      </div>

      <div className={styles['change-group']}>
        <input
          required
          type={showNewPassword ? 'text' : 'password'}
          name="newPassword"
          autoComplete="off"
          className={styles.changeInput}
          readOnly={!editAccountMode}
        />
        <label className={styles['change-label']}>New Password</label>
        {editAccountMode && (
          <span
            className={`${styles['toggle-password1']} ${showNewPassword ? styles.active : ''}`}
            onClick={toggleNewPasswordVisibility}
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        )}
      </div>

      <div className={styles['change-group']}>
        <input
          required
          type={showConfirmPassword ? 'text' : 'password'}
          name="confirmPassword"
          autoComplete="off"
          className={styles.changeInput}
          readOnly={!editAccountMode}
        />
        <label className={styles['change-label']}>Confirm Password</label>
        {editAccountMode && (
          <span
            className={`${styles['toggle-password1']} ${showConfirmPassword ? styles.active : ''}`}
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        )}
      </div>

      {editAccountMode ? (
        <div className={styles['account-button']}>
          <button type="button" className={styles.saveButton} onClick={handleAccountSaveChanges}>
            Save Changes
          </button>
          <button type="button" className={styles.cancelButton} onClick={handleAccountCancelChanges}>
            Cancel
          </button>
        </div>
      ) : (
        <Tooltip title="Edit" placement="top" arrow className={styles.editAccountButton}>
          <IconButton onClick={handleAccountEditClick}>
            <ManageAccountsSharpIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>



      </div>

   </form>

























       {/* for notification and profile */}

          <button className={`${styles.profile} ${isProfileDropdownOpen ? styles.open2 : ''}`} onClick={toggleProfileDropdown}>
            <FontAwesomeIcon icon={faUser as IconProp} />
          </button>

          {isProfileDropdownOpen && (
            <div className={styles.dropdownMenu2}>

              <button className={styles.sub}>
                <FontAwesomeIcon icon={faFaceSmile as IconProp} className={styles.icon} />
                Profile
              </button>

              <button onClick={logInPageHandleClick} className={styles.sub}>
                <FontAwesomeIcon icon={faPowerOff as IconProp} className={styles.icon} />
                Logout
              </button>

            </div>
          )}

          <button className={styles.notif}>
            <FontAwesomeIcon icon={faBell as IconProp} />
          </button>







    </body>
  );
};

export default LogInPage;