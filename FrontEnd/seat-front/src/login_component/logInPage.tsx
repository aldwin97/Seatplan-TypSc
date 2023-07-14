import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './logInPage.module.css';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LogInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  useEffect(() => {
    if (redirectToDashboard) {
      navigate('/dashboardPage');
    }
  }, [redirectToDashboard, navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(false);
  };

  const helpPageHandleClick = () => {
    navigate('/helpPage');
  };

  const viewSeatPageHandleClick = () => {
    navigate('/viewSeatPage');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const dashboardPageHandleClick = () => {
    if (!username || !password) {
      setError(true);
    } else {
      setError(false);
      setRedirectToDashboard(true);
    }
  };

  return (
    <body className={styles.body}>
      <div className={styles.signInContainer}>
        <button onClick={openModal} className={styles.sub} type="submit">
          SIGN IN
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.shape}></div>
            <CloseSharpIcon className={styles.closeButton} onClick={closeModal} />
            <h2>SIGN IN</h2>

            <div className={`${styles['input-group']} ${error && !username && styles.errorInput}`}>
              <input
                required
                type="text"
                name="text"
                autoComplete="off"
                className={styles.input}
                value={username}
                onChange={handleUsernameChange}
              />
              <label className={styles['user-label']}>Username</label>
            </div>

            <div className={`${styles['input-group']} ${error && !password && styles.errorInput}`}>
              <input
                required
                type={showPassword ? 'text' : 'password'}
                name="password"
                autoComplete="off"
                className={styles.input}
                value={password}
                onChange={handlePasswordChange}
              />
              <label className={styles['user-label']}>Password</label>
              <span
                className={`${styles['toggle-password']} ${
                  showPassword ? styles.active : ''
                }`}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
            <button
              onClick={dashboardPageHandleClick}
              className={styles.sub2}
              type="submit"
            >
              SIGN IN
            </button>
          </div>
        </div>
      )}

      <div className={styles.textContainer}>
        <div className={styles.headersContainer}>
          <div className={styles.header1}>
            <div className={styles.text1}>SE</div>
          </div>
          <div className={styles.header2}>
            <div className={`${styles.text2} ${styles.highlight}`}>AT</div>
          </div>
        </div>
        <div className={styles.header3}>
          <div className={`${styles.text3} ${styles.line}`}>MANAGEMENT</div>
        </div>
        <div className={styles.viewButton}>
          <button
            onClick={viewSeatPageHandleClick}
            className={styles.button}
            type="button"
          >
            View Seatplan
          </button>
        </div>
        <div className={styles.supportContainer}>
          <button
            onClick={helpPageHandleClick}
            className={styles.supportLink}
            type="button"
          >
            Support
          </button>
        </div>
      </div>
    </body>
  );
};

export default LogInPage;
