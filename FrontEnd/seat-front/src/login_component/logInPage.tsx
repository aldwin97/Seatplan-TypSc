import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './logInPage.module.css';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';

const LogInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const helpPageHandleClick = () => {
    navigate('/helpPage');
  };

  const dashboardPageHandleClick = () => {
    navigate('/dashboardPage');
  };

  const viewSeatPageHandleClick = () => {
    navigate('/viewSeatPage');
  };

  return (
    <body className={styles.body}>
      <div className={styles.container1}>
        <div className={styles.supportContainer}>
          <button onClick={helpPageHandleClick} className={styles.supportLink} type="button">
            Support
          </button>
        </div>
        <div className={styles.signInContainer}>
          <button onClick={openModal} className={styles.sub} type="submit">
            Sign In
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.shape}></div>
            <CloseSharpIcon className={styles.closeButton} onClick={closeModal} />
            <h2>SIGN IN</h2>

            <div className={styles['input-group']}>
              <input
                required
                type="text"
                name="text"
                autoComplete="off"
                className={styles.input}
              />
              <label className={styles['user-label']}>Username</label>
            </div>

            <div className={styles['input-group']}>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="off"
                className={styles.input}
              />
              <label className={styles['user-label']}>Password</label>
              <span
                className={`${styles['toggle-password']} ${showPassword ? styles.active : ''}`}
                onClick={togglePasswordVisibility}
              >
              </span>
            </div>
            <button onClick={dashboardPageHandleClick} className={styles.sub2} type="submit">
              SIGN IN
            </button>
          </div>
        </div>
      )}

      <div className={styles.textContainer}>
        <div className={styles.header1}>
          <div className={styles.text1}>SE</div>
        </div>
        <div className={styles.header2}>
          <div className={`${styles.text2} ${styles.highlight}`}>AT</div>
        </div>
        <div className={styles.header3}>
          <div className={styles.text3}>MANAGEMENT</div>
        </div>
        <div className={styles.viewButton}>
          <button onClick={viewSeatPageHandleClick} className={styles.button} type="button">
            View Seatplan
          </button>
        </div>
      </div>
    </body>
  );
};

export default LogInPage;
