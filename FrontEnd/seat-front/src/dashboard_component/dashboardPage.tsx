import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button } from '@mui/material';
import styles from './dashboardPage.module.css';
import { Dashboard, Work, Menu } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPowerOff, faSmile } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState({
    left: false,
  });
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

  const toggleDrawer = (anchor: string, open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent
  ) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };

  const closeDrawer = (anchor: string) => () => {
    setState({ ...state, [anchor]: false });
  };

  return (
    <>
      <body>
        <div
          className={`${styles['connect-container']} ${styles['align-content-stretch']} ${styles['d-flex']} ${styles['flex-wrap']}`}
        >
          <div className={styles['page-header']}>
            {(['left'] as const).map((anchor) => (
              <React.Fragment key={anchor}>
                <Button onClick={toggleDrawer(anchor, true)}>
                  <i className={styles['menu-out']}>
                    <Menu />
                  </i>
                </Button>
                <SwipeableDrawer
                  open={state[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  onOpen={toggleDrawer(anchor, true)}
                >
                  <div className={styles['page-sidebar']}>
                    <div className={styles['logo-box']}>
                      <span className={styles['logo-text']}>Seat</span>
                      <i
                        className={styles['menu']}
                        onClick={toggleDrawer(anchor, false)}
                      >
                        <Menu />
                      </i>
                      <div
                        className={`${styles['page-sidebar-inner']} ${styles['slimscroll']}`}
                      >
                        <ul className={styles['accordion-menu']}>
                          <li className={styles['sidebar-title']}>Apps</li>
                          <li className={styles['active-page']}>
                            <a href="index.html" className={styles['active']}>
                              <i
                                className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}
                              >
                                <Dashboard />
                              </i>
                              Dashboard
                            </a>
                          </li>
                          <li>
                            <a href="index.html" className={styles['active']}>
                              <i
                                className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}
                              >
                                <Work />
                              </i>
                              Project
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </SwipeableDrawer>
              </React.Fragment>
            ))}
            <div className={styles['page-header']}>
              <button
                className={`${styles.dropdown} ${isProfileDropdownOpen ? styles.open2 : ''}`}
                onClick={toggleProfileDropdown}
              >
                <FontAwesomeIcon icon={faUser} />
              </button>

              {isProfileDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button className={styles.dropdownItem}>
                    <FontAwesomeIcon icon={faSmile} className={styles.icon} />
                    Profile
                  </button>

                  <button onClick={logInPageHandleClick} className={styles.dropdownItem}>
                    <FontAwesomeIcon icon={faPowerOff} className={styles.icon} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </body>
    </>
  );
};

export default DashboardPage;
