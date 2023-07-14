import React, { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { Button, } from '@mui/material';
import styles from './dashboardPage.module.css';
import {  Dashboard, Work, Menu, } from '@mui/icons-material';


const DashboardPage: React.FC = () => {
  const [state, setState] = useState({
    left: false,
    
  });

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
      
      <div className={`${styles['connect-container']} ${styles['align-content-stretch']} ${styles['d-flex']} ${styles['flex-wrap']}`}>
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
                   <a href="#" className={styles['logo-text']}>
                     Seat
                   </a>
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
                   </div>
                   </div>
                        
       </div>
      </body>
    </>
  );
};

export default DashboardPage;
