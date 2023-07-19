import React, { useState,  useEffect, useRef } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {  Button } from '@mui/material';
import styles from './dashboardPage.module.css';
import { Dashboard, Work, Menu, SupervisedUserCircle, PersonPinCircleRounded, PersonAddAltRounded, GroupsRounded, PeopleOutlineRounded, Diversity3Rounded } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';





const DashboardPage: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChart = useRef<Chart | null>(null);
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        if (myChart.current) {
          myChart.current.destroy(); // Destroy the previous chart
        }

        myChart.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Occupied', 'Available', 'Under Maintenance'],
            datasets: [
              {
                label: 'Seat Conditions',
                data: [50, 60, 20],
                backgroundColor: [ 'rgba(75, 192, 192, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 99, 132, 0.2)'],
                borderWidth: 1,
                
               
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
               
              },
            },
          },
        });
      }
    }
    return () => {
      if (myChart.current) {
        myChart.current.destroy(); // Clean up the chart on unmount
      }
    };
  }, []);
  const navigate = useNavigate();
 
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState<boolean>(false);

 
  const toggleProfileDropdown = (): void => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const logInPageHandleClick = () => {
    // Make a request to the server to logout
    fetch('/logout', {
      method: 'GET',
      credentials: 'include', // This is important to include cookies (e.g., the session cookie)
    })
      .then((response) => {
        if (response.ok) {
          // Successful logout
          // Remove session information from the session storage
          console.log('Logout successful');

          // Remove session data from the session storage
          window.sessionStorage.removeItem('user_id'); // Replace 'user_id' with the actual key used for user_id
          // You may redirect to the login page or do other operations as needed
          navigate('/login'); // Redirect to the login page after logout
        } else {
          // Handle errors, if any
          console.error('Logout failed');
        }
      })
      .catch((error) => {
        console.error('Error occurred during logout:', error);
      });
  };
  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
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
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
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
        <FontAwesomeIcon icon={faUser}  className={styles.uicon}/>
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
         
          <div className={styles.cardimg2}><SupervisedUserCircle style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount2 }>500</div>
          <div className={styles.cardtitle2}>TOTAL SEAT</div>
            </div>
        

          <div className={styles.card3}>
            <div className={styles.cardimg2}><PersonPinCircleRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount2 }>150</div>
            <div className={styles.cardtitle2}>OCCUPIED SEAT</div>
          </div>
          
          <div className={styles.card4}>
          <div className={styles.cardimg2}>< PersonAddAltRounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount2 }>350</div>
            <div className={styles.cardtitle2}>AVAILABLE SEAT</div>
          </div>
          <div>
          <div className={styles.card5}>
    <svg className={styles.cardimg5}></svg>
    <div className={styles.cardtitle3}>SEAT CONDITIONS</div>
    <div >
      <canvas ref={chartRef} />
    </div>
  </div>
          </div>
          <div className={styles.card6}>
          <div className={styles.cardimg3}><GroupsRounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount2}>150</div>
          <div className={styles.cardtitle3}>TOTAL EMPLOYEE</div>
          </div>

          <div className={styles.card7}>
          <div className={styles.cardimg3}><Diversity3Rounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount2 }>45</div>
            <div className={styles.cardtitle3}>TRAINEE</div>
          </div>

          <div className={styles.card8}>
            <svg className={styles.cardimg8}></svg>
           
            <div className={styles.cardimg3}><PeopleOutlineRounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount2 }>45</div>
            <div className={styles.cardtitle3}>REGULAR EMPLOYEE</div>
          </div>
          
          </form>

          <form className={styles.form4}>
         
          <div className={styles.scrollable}>
          <div className={styles.card9}>
            <svg className={styles.cardimg9}></svg>
            <div className={styles.cardtitle3}>RECENT COMMENTS</div>
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


