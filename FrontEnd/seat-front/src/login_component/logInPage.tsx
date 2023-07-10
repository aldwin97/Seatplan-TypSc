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
    <body className={styles.body1}>
      <div className={styles.container1}>
        <div className={styles.signInContainer}>
          <button onClick={dashboardPageHandleClick} className={styles.sub} type="submit">
            Sign In
          </button>
        </div>
        <div className={styles.supportContainer}>
          <button onClick={helpPageHandleClick} className={styles.supportLink} type="button">
            Support
          </button>
        </div>
      </div>
      <div className={styles.textContainer}>
        <div className={styles.header1}>
          <h1 className={styles.text1}>MANAGEMENT</h1>
        </div>
        <div className={styles.header2}>
          <h2 className={styles.text2}>"Elevating Office Comfort and Collaboration"</h2>
        </div>
      </div>
      <div className={styles.logoContainer}>
        <div className={styles.logo1}>
          <h3 className={styles.des1}>SE</h3>
        </div>
      </div>
    </body>
  );
};

export default LogInPage;
