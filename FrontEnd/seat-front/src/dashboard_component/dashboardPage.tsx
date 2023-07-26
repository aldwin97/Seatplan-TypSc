
  import React, { useState,  useEffect, useRef } from 'react';
  import SwipeableDrawer from '@mui/material/SwipeableDrawer';
  import {Tooltip,Button,List,ListItem,ListItemText,Divider,Typography,ListItemAvatar, Avatar,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, TablePagination} from '@mui/material';
  import styles from './dashboardPage.module.css';
  import { Dashboard,Chair, Groups, Work, AccountBox, Menu, Logout, SupervisedUserCircle, PersonPinCircleRounded, PersonAddAltRounded, GroupsRounded, PeopleOutlineRounded, Diversity3Rounded, BoltRounded, Margin } from '@mui/icons-material';
  import { useNavigate } from 'react-router-dom';
  import Chart from 'chart.js/auto';
  import axios from 'axios';
  import 'chartjs-plugin-datalabels';



  
  interface Column {
    id: 'ProjectName' | 'seatCount' ;
    label: string;
    minWidth?: number;
    align?: 'right';
    format?: (value: number) => string;
  }

  const DashboardPage: React.FC = () => {
    const [rows, setRows] = useState<Data[]>([]);
    const [comments, setComments] = useState([]);
    const [dashboardData, setDashboardData] = useState<any>({});
    const [last_name, setLastName] = useState('');
    const [first_name, setFirstName] = useState('');
    const chartHeight = 320; 
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const myChart = useRef<Chart | null>(null);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };
    useEffect(() => {
      const fetchDashboardData = async () => {
        try {
          const response = await axios.get('http://localhost:8080/dashboard/display');
          if (response && response.data) {
            setDashboardData(response.data);
          }
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
        }
      };
    

      fetchDashboardData();
      const storedLastname = window.sessionStorage.getItem('last_name');
      setLastName(storedLastname ?? ''); 
      const storedFirstname = window.sessionStorage.getItem('first_name');
      setFirstName(storedFirstname ?? '');
    }, []);

    
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
                  data: [dashboardData.countOccupied, dashboardData.countSeatAvailable, dashboardData.countUnderMaintenance],
                  backgroundColor: ['rgba(47, 167, 58, 0.5)', 'rgba(47, 167, 58, 0.5)', 'rgba(47, 167, 58, 0.5)'],
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
                  display: false,
                },
                datalabels: { 
                  anchor: 'end',
                  align: 'top',
                  formatter: (value: number) => {
                    // Add your formatting logic here if needed
                    return value.toString();
                  },
                },
              },
            },
          });
        }
      }

      return () => {
        if (myChart.current) {
          myChart.current.destroy(); 
        }
      };
    }, ); 
    const [isDrawerOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
      setDrawerOpen(!isDrawerOpen);
    };
  
    
  /*table for project overview*/

  const columns: readonly Column[] = [
    { id: 'ProjectName', label: 'Project Name', minWidth: 180},
    { id: 'seatCount', label: 'Occupied Seat', minWidth: 30 ,},
    
  
  ];

  interface Data {
    ProjectName: string;
    seatCount: number;
  }
  function createData(projectName: string, seatCount: number): Data {
    return { ProjectName: projectName, seatCount: seatCount };
  }
  

  useEffect(() => {
    // Fetch the data from the endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard/countPerProject');
        const data = response.data;
        
        // Loop through the data and create the 'rows' array
        const newRows: Data[] = data.map((item: any) =>
          createData(item.project_name, item.seatCount)
        );
        
        // Set the 'rows' state with the new data
        setRows(newRows);
      } catch (error) {
        console.error('Error fetching countPerProject data:', error);
      }
    };

    // Call the function to fetch data
    fetchData();
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard/showAllComment');
        if (response && response.data) {
          setComments(response.data);
        }
      } catch (error) {
        console.error('Error fetching comments data:', error);
      }
    };

    fetchComments();
  }, []);

  const navigate = useNavigate();

  const projectPageHandleClick = () => {
    navigate('/ProjectPage');
  };
  const dashboardPageHandleClick = () => {
    navigate('/DashboardPage');
  };
  const adminPageHandleClick = () => {
    navigate('/AdminPage');
  };
  const ProfilePageHandleClick = () => {
    navigate('/ProfilePage');
  };
  const SeatplanPageHandleClick = () => {
    navigate('/seatPlanPage');
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
                    <a onClick={dashboardPageHandleClick} className={styles['active']}>
                      <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                        <Dashboard/>
                      </i>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a onClick={ProfilePageHandleClick} className={styles['active']}>
                      <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                        <AccountBox/>
                      </i>
                      Profile
                    </a>
                  </li>
                  <li>
                    <a onClick={projectPageHandleClick} className={styles['active']}>
                      <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                        <Work/>
                      </i>
                      Project
                    </a>
                  </li>
                  <li>
                    <a onClick={adminPageHandleClick} className={styles['active']}>
                      <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                        <Groups/>
                      </i>
                      Members
                    </a>
                  </li>
                  <li>
                    <a onClick={SeatplanPageHandleClick} className={styles['active']}>
                      <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                        <Chair/>
                      </i>
                      Seat
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
              
            
        <div className={styles.container}>
          <div className={styles.main}>

            <div className={styles.cardHello}>
              <svg className={styles.Helloimg}></svg>
              <div className={styles.Hellotitle}>HELLO <br/>{first_name} {last_name}</div>
            </div>
              
              <div className={styles.countcontainer}>
                <div className={styles.card1}>
                <div className={styles.cardicon}><SupervisedUserCircle style={{ fontSize: 42 }}/></div>
                <div className={styles.cardcount }>{dashboardData.countOccupied+dashboardData.countSeatAvailable+dashboardData.countUnderMaintenance}</div>
                <div className={styles.cardtitle}>TOTAL SEAT</div>
              </div>
          

            <div className={styles.card2}>
              <div className={styles.cardicon}><PersonPinCircleRounded style={{ fontSize: 42 }}/></div>
              <div className={styles.cardcount}>{dashboardData.countOccupied}</div>
              <div className={styles.cardtitle}>OCCUPIED SEAT</div>
            </div>
            
            <div className={styles.card3}>
            <div className={styles.cardicon}>< PersonAddAltRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount }>{dashboardData.countSeatAvailable}</div>
              <div className={styles.cardtitle}>AVAILABLE SEAT</div>
            </div>
            

            
            
            <div className={styles.card4}>
            <div className={styles.cardicon}><GroupsRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount}>{dashboardData.countUser}</div>
            <div className={styles.cardtitle}>TOTAL EMPLOYEE</div>
            </div>

            <div className={styles.card5}>
            <div className={styles.cardicon}><Diversity3Rounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount }>{dashboardData.countAssignedEmpIntern + dashboardData.countAssignedEmpTrainee + dashboardData.countAssignedEmpRegular + dashboardData.countAssignedEmpContractual} </div>
            <Tooltip
          title={
            <div className={styles.tooltipContent}>
             
              
              <span>Intern:{dashboardData.countAssignedEmpIntern}</span>
              <br />
              <span>Trainee:{dashboardData.countAssignedEmpTrainee}</span>
              <br />
              <span>Regular:{dashboardData.countAssignedEmpRegular} </span>
              <br />
              <span>Contractual:{dashboardData.countAssignedEmpContractual}</span>
            </div>
          }
          arrow
        >
            <div className={styles.cardtitle}>ASSIGNED EMPLOYEE</div>
        </Tooltip>
            
            </div>

            <div className={styles.card6}>
              <div className={styles.cardicon}><PeopleOutlineRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount}>{dashboardData.countUnassignedEmpIntern}</div>
            <Tooltip
          title={
            <div className={styles.tooltipContent}>
            <span>Intern:{dashboardData.countUnassignedEmpIntern}</span>
              <br />
              <span>Trainee:{dashboardData.countUnassignedEmpTrainee}</span>
              <br />
              <span>Regular:{dashboardData.countUnassignedEmpRegular} </span>
              <br />
              <span>Contractual:{dashboardData.countUnassignedEmpContractual}</span>
            </div>
          }
          arrow
        >
          <div className={styles.cardtitle}>UNASSIGNED EMPLOYEE</div>
        </Tooltip>
            </div>
            
              </div>
            
              <div className={styles.cardseat}>
                  <div className={styles.cardtitle1}>SEAT CONDITIONS </div>
                  <div className={styles.chartcontainer}>
                  <canvas ref={chartRef} style={{ height: `${chartHeight}px` , marginTop:'55px' }} />
                  </div>
                  
            <div className={styles.cardcomment}>
                  <div className={styles.cardtitle2}>RECENT COMMENT</div>
                  <div className={styles.commentcontent}>
                  <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Brunch this weekend?"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Ali Connors
                </Typography>
                {" — I'll be in your neighborhood doing errands this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Travis Howard" src="/static/images/avatar/2.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Summer BBQ"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  to Scott, Alex, Jennifer
                </Typography>
                {" — Wish I could come, but I'm out of town this…"}
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
          </ListItemAvatar>
          <ListItemText
            primary="Oui Oui"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  Sandra Adams
                </Typography>
                {' — Do you have Paris recommendations? Have you ever…'}
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
        
                  
                  </div>
            </div>
            <div className={styles.projectCard}>
            <div className={styles.cardtitle2}>SUMMARY</div>
            <div className={styles.projectcontent}>
              
            <Paper sx={{ width: '100%', overflow: 'hidden',borderRadius: '10px' }}>
        <TableContainer sx={{ maxHeight: 440, marginLeft:'20px', }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.seatCount}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell style={{color:'gray', fontSize:'13px', }} key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                              
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper></div>
      
      </div>
            </div>
            
          </div>
        </div>
        
    
        
        </body>
      </>
    );
  };

  export default DashboardPage;


