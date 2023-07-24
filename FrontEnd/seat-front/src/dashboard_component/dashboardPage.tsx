
import React, { useState,  useEffect, useRef } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import {  Button} from '@mui/material';
import styles from './dashboardPage.module.css';
import { Dashboard, Groups, Work, Menu, Logout, SupervisedUserCircle, PersonPinCircleRounded, PersonAddAltRounded, GroupsRounded, PeopleOutlineRounded, Diversity3Rounded } from '@mui/icons-material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Chart from 'chart.js/auto';



const DashboardPage: React.FC = () => {
  const chartHeight = 320; 
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const myChart = useRef<Chart | null>(null);
  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');

      if (ctx) {
        if (myChart.current) {
          myChart.current.destroy(); // Destroy the previo us chart
        }

        myChart.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Occupied', 'Available', 'Under Repair'],
            datasets: [
              {
                label: 'Seat Conditions',
                data: [100, 60, 200],
                backgroundColor: [ 'rgba(47, 167, 58, 0.5)',
                'rgba(47, 167, 58, 0.5)',
                'rgba(47, 167, 58, 0.5)'],
                borderColor: '#2FA73A',
                borderWidth: 2,
                
               
              },
            ],
          },
          options: {
            indexAxis: 'x',
            scales: {
              x: {
                beginAtZero: true,
                
              },
             
            },
            plugins: {
              legend: {
                display: false, // Set display to false to remove the legend and small squares
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
                <li>
                  <a href="index.html" className={styles['active']}>
                    <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                      <Groups/>
                    </i>
                    Members
                  </a>
                </li>
                <li>
                  <a href="index.html" className={styles['active']}>
                    <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                      <Logout/>
                    </i>
                    Logout
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


      <div className={styles.container}>
        <div className={styles.main}>

          <div className={styles.cardHello}>
            <svg className={styles.Helloimg}></svg>
            <div className={styles.Hellotitle}>HELLO <br/>(USERNAME)</div>
            <div className={styles.Hellotext}>Welcome Back! You have 2 Notifications</div></div>
            
            <div className={styles.countcontainer}>
              <div className={styles.card1}>
              <div className={styles.cardicon}><SupervisedUserCircle style={{ fontSize: 42 }}/></div>
              <div className={styles.cardcount }>500</div>
              <div className={styles.cardtitle}>TOTAL SEAT</div>
             </div>
        

          <div className={styles.card2}>
            <div className={styles.cardicon}><PersonPinCircleRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount}>150</div>
            <div className={styles.cardtitle}>OCCUPIED SEAT</div>
          </div>
          
          <div className={styles.card3}>
          <div className={styles.cardicon}>< PersonAddAltRounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount }>350</div>
            <div className={styles.cardtitle}>AVAILABLE SEAT</div>
          </div>
          

          
          
          <div className={styles.card4}>
          <div className={styles.cardicon}><GroupsRounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount}>150</div>
          <div className={styles.cardtitle}>TOTAL EMPLOYEE</div>
          </div>

          <div className={styles.card5}>
          <div className={styles.cardicon}><Diversity3Rounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount }>45</div>
            <div className={styles.cardtitle}>TRAINEE</div>
          </div>

          <div className={styles.card6}>
            <div className={styles.cardicon}><PeopleOutlineRounded style={{ fontSize: 42 }}/></div>
          <div className={styles.cardcount}>45</div>
            <div className={styles.cardtitle}>REGULAR EMPLOYEE</div>
          </div>
          
            </div>
          
            <div className={styles.cardseat}>
                <div className={styles.cardtitle1}>SEAT CONDITIONS </div>
                <div className={styles.chartcontainer}>
                <canvas ref={chartRef} style={{ height: `${chartHeight}px` , marginTop:'55px' }} />
                </div>
                <div className={styles.cardcomment}>
                <div className={styles.cardtitle}>RECENT COMMENTS </div>
                <div className={styles.chartcontainer}>
                
                </div>
          </div>
          
          </div>
          
        </div>
      </div>
 
       
  
       
      </body>
    </>
  );
};

export default DashboardPage;


