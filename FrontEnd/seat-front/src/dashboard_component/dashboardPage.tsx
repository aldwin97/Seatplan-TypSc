import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import styles from './dashboardPage.module.css';
import { Dashboard, Work, Menu } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
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
        
          <div >
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


      <div className={styles.container2}>
        <form className={styles.main2}>

          <form className={styles.form3}>


         
        <form className={styles.form2}>
        <form className={styles.form}>

<div className={styles.card}>
  <svg className={styles.cardimg}></svg>
  <div className={styles.cardtitle}>HELLO (USERNAME)</div>
  <div className={styles.cardtext}>Welcome Back! Always check you Notifications!</div>
  <div className={styles.date}>Today is</div>
  <div className={styles.time}></div>
</div>
</form>
          <div className={styles.card2}>
            <svg className={styles.cardimg2}></svg>
            <div className={styles.cardtitle2}>TOTAL SEAT</div>
          </div>

          <div className={styles.card3}>
            <svg className={styles.cardimg3}></svg>
            <div className={styles.cardtitle3}>OCCUPIED SEAT</div>
          </div>
          
          <div className={styles.card4}>
            <svg className={styles.cardimg4}></svg>
            <div className={styles.cardtitle4}>AVAILABLE SEAT</div>
          </div>
          <div>
          <div className={styles.card5}>
    <svg className={styles.cardimg5}></svg>
    <div className={styles.cardtitle5}>SEAT CONDITIONS</div>
  </div>
          </div>
          <div className={styles.card6}>
            <svg className={styles.cardimg6}></svg>
            <div className={styles.cardtitle6}>TOTAL EMPLOYEE</div>
          </div>

          <div className={styles.card7}>
            <svg className={styles.cardimg7}></svg>
            <div className={styles.cardtitle7}>TRAINEE</div>
          </div>

          <div className={styles.card8}>
            <svg className={styles.cardimg8}></svg>
            <div className={styles.cardtitle8}>REGULAR EMPLOYEE</div>
          </div>
          
          </form>

          <form className={styles.form4}>
         
          <div className={styles.scrollable}>
          <div className={styles.card9}>
            <svg className={styles.cardimg9}></svg>
            <div className={styles.cardtitle9}>RECENT COMMENTS</div>
          </div></div>
    </form>
          
        </form>
        </form>
 
        </div>
        </div>
       
      </body>
    </>
  );
};

export default DashboardPage;
