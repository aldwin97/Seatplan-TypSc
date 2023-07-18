import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './profilePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUser, faBell, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';



const LogInPage: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const logInPageHandleClick = (): void => {
    navigate('/');
  };




  // const populateProfileSummary = () => {
  //   const firstNameInput = document.querySelector<HTMLInputElement>('input[name="FirstName"]');
  //   const lastNameInput = document.querySelector<HTMLInputElement>('input[name="LastName"]');
  //   const usernameInput = document.querySelector<HTMLInputElement>('input[name="username"]');
  //   const emailInput = document.querySelector<HTMLInputElement>('input[name="Email"]');
  //   const contactNumberInput = document.querySelector<HTMLInputElement>('input[name="ContactNumber"]');

  //   if (firstNameInput && lastNameInput && usernameInput && emailInput && contactNumberInput) {
  //     const fullName = `${firstNameInput.value} ${lastNameInput.value}`;
  //     document.getElementById('fullName')!.textContent = fullName;
  //     document.getElementById('username')!.textContent = usernameInput.value;
  //     document.getElementById('email')!.textContent = emailInput.value;
  //     document.getElementById('contactNumber')!.textContent = contactNumberInput.value;
  //   }
  // };

  // useEffect(() => {
  //   populateProfileSummary();
  // }, []);





  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);
  const toggleProfileDropdown = (): void => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  return (
    <body className={styles.backg}>
      
      {/* Cards */}
      <form className={styles.form1}>
      {/* <div className={styles.profileSum}>
          <h2>Profile Summary</h2>
          <p><strong>Full Name</strong> <span id="fullName"></span></p>
          <p><strong>Username</strong> <span id="username"></span></p>
          <p><strong>Email Address</strong> <span id="email"></span></p>
          <p><strong>Contact Number</strong> <span id="contactNumber"></span></p>
        </div> */}
      <div className={styles.set}>
      <div className={styles.personal}>
     
      <h1>Personal Information</h1>
        <div className={styles['name-group']}>
          <input
            required
            type="text"
            name="FirstName"
            autoComplete="off"
            className={styles.nameInput}
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
          />
          <label className={styles['user-label']}>Contact Number</label>
        </div>
      </div>











      <div className={styles.accountS}>
        <h1>Account Settings</h1>
       <div className={styles['input-group']}>
          <input required 
            type="text" 
            name="username" 
            autoComplete="off" 
            className={styles.input} />
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

        <div className={styles['input-group1']}>
          <input
            required
            type={showNewPassword ? 'text' : 'password'}
            name="newPassword"
            autoComplete="off"
            className={styles.input}
          />
          <label className={styles['user-label']}>New Password</label>
          <span
            className={`${styles['toggle-password']} ${showNewPassword ? styles.active : ''}`}
            onClick={toggleNewPasswordVisibility}
          >
            {showNewPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <div className={styles['input-group1']}>
          <input
            required
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            autoComplete="off"
            className={styles.input}
          />
          <label className={styles['user-label']}>Confirm Password</label>
          <span
            className={`${styles['toggle-password']} ${showConfirmPassword ? styles.active : ''}`}
            onClick={toggleConfirmPasswordVisibility}
          >
            {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>
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