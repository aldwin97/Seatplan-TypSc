import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './profilePage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';

const ProfilePage: React.FC = () => {
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(true);
  const navigate = useNavigate();

  const toggleOldPasswordVisibility = (): void => {
    setShowOldPassword(!showOldPassword);
  };

  const toggleNewPasswordVisibility = (): void => {
    setShowNewPassword(!showNewPassword);
  };

  const toggleConfirmPasswordVisibility = (): void => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const dashboardPageHandleClick = (): void => {
    navigate('/DashboardPage');
  };

  const adminPageHandleClick = (): void => {
    navigate('/AdminPage');
  };

  const seatplanPageHandleClick = (): void => {
    navigate('/SeatplanPage');
  };

  const logInPageHandleClick = (): void => {
    navigate('/');
  };

  const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

  const toggleDropdown = (): void => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = (): void => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handlePersonalSaveChanges = (): void => {
    // Perform actions to save the changes
    // This can include sending the form data to the server or updating the state
    console.log('Saving changes...');
  };

  const handlePersonalCancelChanges = (): void => {
    // Reset the form fields to their initial values or clear them
    // Perform any other necessary actions when canceling changes
    console.log('Canceling changes...');
  };

  const handleAccountSaveChanges = (): void => {
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

  const handleAccountCancelChanges = (): void => {
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
                <FontAwesomeIcon icon={faChartBar as IconProp} className={styles.icon} />
                Dashboard
              </button>

              <button onClick={adminPageHandleClick} className={styles.sub}>
                <FontAwesomeIcon icon={faUsers as IconProp} className={styles.icon} />
                Members
              </button>

              <button onClick={seatplanPageHandleClick} className={styles.sub}>
                <FontAwesomeIcon icon={faProjectDiagram as IconProp} className={styles.icon} />
                Projects
              </button>

            </div>
          )}

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
        </div>

        <div className={styles.prof}>
          <form className={styles.form1}>



            <h1>PERSONAL INFORMATION</h1>


            <div className={styles['input-group']}>
              <input required type="text" name="firstName" autoComplete="off" className={styles.input} />
              <label className={styles['user-label']}>First Name</label>
            </div>

            <div className={styles['input-group']}>
              <input required type="text" name="lastName" autoComplete="off" className={styles.input} />
              <label className={styles['user-label']}>Last Name</label>
            </div>

            <div className={styles['input-group']}>
              <input required type="text" name="emailAddress" autoComplete="off" className={styles.input} />
              <label className={styles['user-label']}>Email Address</label>
            </div>


            <div className={styles['input-group']}>
              <input required type="number" name="contactNumber" autoComplete="off" className={styles.input} />
              <label className={styles['user-label']}>Contact Number</label>
            </div>



            <div className={styles['button-group']}>
 
              <button type="button" className={styles.saveButton} onClick={handlePersonalSaveChanges}>
                Save Changes
              </button>
              <button type="button" className={styles.cancelButton} onClick={handlePersonalCancelChanges}>
                Cancel
              </button>
            </div>


            <h1>ACCOUNT SETTINGS</h1>



            <div className={styles['input-group']}>
              <input required type="text" name="username" autoComplete="off" className={styles.input} />
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
        


        <div className={styles.card}>
          <form className={styles.form2}>

          <div className="card__img"></div>
          <div className="card__avatar"></div>
          <div className="card__name">FULL NAME</div>
          <div className="card__username">username</div>
          <div className="card__position">position</div>

          <div className="card__wrapper">

          <button className="card__btn">Button</button>
          <button className="card__btn card__btn-solid">Button</button>

          </div>

          </form>
        </div>



      </body>
    </>
  );
};

export default ProfilePage;

