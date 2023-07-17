import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {  Button } from '@mui/material';
import styles from './dashboardPage.module.css';
import { Dashboard, Work, Menu } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';




const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
 
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

 
  const toggleProfileDropdown = (): void => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };


  

  const logInPageHandleClick = (): void => {
    navigate('/');
  };

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };

  const handleSwipe = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };
  return (
    <>
      <body>
        
      <Button onClick={toggleDrawer}>
        <i className={styles['menu-out']}>
          <Menu />
        </i>
      </Button>
      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleSwipe(false)}
        onOpen={handleSwipe(true)}
        variant="persistent"
        className={isDrawerOpen ? styles['sidebar-open'] : styles['sidebar-closed']}
      >
      
        <div className={styles['page-sidebar']}>
          <div className={styles['logo-box']}>
            <span className={styles['logo-text']}>Seat</span>
            <i className={styles['menu']} onClick={toggleDrawer}>
              <Menu />
            </i>
            <div className={`${styles['page-sidebar-inner']} ${styles['slimscroll']}`}>
              {/* Replace the following with your actual sidebar content */}
              <ul className={styles['accordion-menu']}>
                <li className={styles['sidebar-title']}>Apps</li>
                <li className={styles['active-page']}>
                  <a href="index.html" className={styles['active']}>
                    <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                      <Dashboard/>
                    </i>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="index.html" className={styles['active']}>
                    <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                      <Work/>
                    </i>
                    Project
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </SwipeableDrawer>
            
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
  <div className={styles.cardtitle}>HELLO <br/>(USERNAME)</div>
  <div className={styles.cardtext}>Welcome Back! You have 2 Notifications</div>
  
</div>
</form>
          <div className={styles.card2}>
            <svg className={styles.cardimg2}><FontAwesomeIcon icon={faUser} /></svg>
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
  
       
      </body>
    </>
  );
};

export default DashboardPage;


