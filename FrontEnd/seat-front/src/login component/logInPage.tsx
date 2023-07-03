import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import styles from './logInPage.module.css';

const LogInPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const viewSeatPageHandleClick = () => {
    navigate('/viewSeatPage');
  };

  return (
    <body>
      <div className={styles.container1}>
        <form className={styles.form1}>
          <h2>Log in</h2>
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
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button className={styles.sub} type="submit">
            SIGN IN
          </button>
          <button
            className={styles.sub}
            type="button"
            onClick={viewSeatPageHandleClick}
          >
            VIEW SEAT PLAN
          </button>
          <a href="facebook.com">Need Help?</a>
        </form>
      </div>
    </body>
  );
};

export default LogInPage;
