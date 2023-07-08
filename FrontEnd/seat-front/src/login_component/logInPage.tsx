import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './logInPage.module.css';

const LogInPage: React.FC = () => {
  const navigate = useNavigate();
  const helpPageHandleClick = () => {
    navigate('/helpPage');
  };
  const dashboardPageHandleClick = () => {
    navigate('/dashboardPage');
  };
  return (
    <div className={styles.form1}>
      <div className={styles.container1}>
        <div className={styles.signInContainer}>
          <button onClick={dashboardPageHandleClick} className={styles.sub} type="submit">
            Sign In
          </button>
        </div>
      </div>
      <div className={styles.container2}>
        <button onClick={helpPageHandleClick} className={styles.supportLink} type="button">
          Support
        </button>
      </div>
      <div className={styles.textContainer}>
        <h1>Management</h1>
      </div>
    </div>
  );
};

export default LogInPage;

