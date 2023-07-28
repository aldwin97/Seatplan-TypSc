
  import React, { useState,  useEffect, useRef } from 'react';
  import SwipeableDrawer from '@mui/material/SwipeableDrawer';
  import {Tooltip,Button,List,ListItem,ListItemText,Divider,Typography,ListItemAvatar, Avatar,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper, TablePagination} from '@mui/material';
  import styles from './dashboardPage.module.css';
  import { Dashboard,Chair, Groups, Work, AccountBox, Menu, Logout, SupervisedUserCircle, GroupsRounded, PeopleOutlineRounded, Diversity3Rounded } from '@mui/icons-material';
  import { useNavigate } from 'react-router-dom';
  import Chart from 'chart.js/auto';
  import axios from 'axios';
  import 'chartjs-plugin-datalabels';
  import occupied from './asset/occupied.png'
  import available from './asset/available.png'
  import totalseat from './asset/totalseat.png'


  interface ProjectSummary {
    project_name: string;
    seatCount: number;
  }

  const DashboardPage: React.FC = () => {
    const [com, setComments] =  useState<Comments[]>([]);
    const [dashboardData, setDashboardData] = useState<any>({});
    const chartHeight = 320; 
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const myChart = useRef<Chart | null>(null);

    const [UserData, setUserData] = useState<UserData | null>(null);
    const [projectSummary, setProjectSummary] = useState<ProjectSummary[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
    interface CommentCardProps {
      com: Comments[];
    }
    
    interface Comments {
      full_name: string;
      comment: string;
      created_time: string;
      seat_id:number;
    }
    
    interface UserData {
      first_name: string;
      last_name: string;
      position_name: string;
    }
  
  
    useEffect(() => {
      const user_id = window.sessionStorage.getItem('user_id');
  
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/dashboard/showLogedUserInfo/${user_id}`);
  
          const responseData: UserData = response.data[0];
          setUserData(responseData);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      };
  
      fetchUserData();
    }, []);

    useEffect(() => {
      // Fetch the data from the endpoint
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:8080/dashboard/showAllComment');
          const data: Comments[] = response.data;
  
          
          setComments(data);
        } catch (error) {
          console.error('Error fetching showAllComment:', error);
        }
      };
  
      
      fetchData();
    }, []);


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
    }, []);

    
    useEffect(() => {

      if (chartRef.current) {
        const ctx = chartRef.current.getContext('2d');

        if (ctx) {
          if (myChart.current) {
            myChart.current.destroy();
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
  useEffect(() => {

    const fetchProjectSummary = async () => {
      try {
        const response = await axios.get('http://localhost:8080/dashboard/countPerProject');
        const data = response.data;

        // Set the project summary state with the fetched data
        setProjectSummary(data);
      } catch (error) {
        console.error('Error fetching project summary data:', error);
      }
    };

    // Call the function to fetch project summary data
    fetchProjectSummary();
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
  const formatTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
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
      {UserData ? (
        <div className={styles.Hellotitle}>
          {UserData.first_name} {UserData.last_name}
          <div className={styles.Hellotitle1}>{UserData.position_name}</div>
        </div>
        
      ) : (
        <div>Loading...</div>
      )}
       
    </div>
              
              <div className={styles.countcontainer}>
                <div className={styles.card1}>
                <div className={styles.cardicon}><img src={totalseat} alt='Profile Background'/></div>
                <div className={styles.cardcount }>{dashboardData.countOccupied+dashboardData.countSeatAvailable+dashboardData.countUnderMaintenance}</div>
                <div className={styles.cardtitle}>TOTAL SEATS</div>
              </div>
          

            <div className={styles.card2}>
              <div className={styles.cardicon}><img src={occupied} alt='Profile Background'/></div>
              <div className={styles.cardcount}>{dashboardData.countOccupied}</div>
              <div className={styles.cardtitle}>OCCUPIED SEATS</div>
            </div>
            
            <div className={styles.card3}>
            <div className={styles.cardicon}><img src={available} alt='Profile Background'/></div>
            <div className={styles.cardcount }>{dashboardData.countSeatAvailable}</div>
              <div className={styles.cardtitle}>AVAILABLE SEATS</div>
            </div>

            <div className={styles.card4}>
            <div className={styles.cardicon}><GroupsRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount}>{dashboardData.countUser}</div>
            <div className={styles.cardtitle}>TOTAL ASSOCIATES</div>
            </div>

            <div className={styles.card5}>
            <div className={styles.cardicon}><Diversity3Rounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount }>{dashboardData.countAssignedEmpIntern + dashboardData.countAssignedEmpTrainee + dashboardData.countAssignedEmpRegular + dashboardData.countAssignedEmpContractual} </div>
            <Tooltip
          title={
            <div className={styles.tooltipContent}>
             
              
             <span>Regular:{dashboardData.countAssignedEmpRegular} </span>
              <br />
              <span>Trainee:{dashboardData.countAssignedEmpTrainee}</span>
              <br />
              <span>Intern:{dashboardData.countAssignedEmpIntern}</span>
              <br />
              <span>Business Partner:{dashboardData.countAssignedEmpContractual}</span>
            </div>
          }
          arrow
        >
            <div className={styles.cardtitle}>WITH ASSIGNED SEATS</div>
        </Tooltip>
            
            </div>

            <div className={styles.card6}>
              <div className={styles.cardicon}><PeopleOutlineRounded style={{ fontSize: 42 }}/></div>
            <div className={styles.cardcount}>{dashboardData.countUnassignedEmpIntern + dashboardData.countUnassignedEmpTrainee + dashboardData.countUnassignedEmpRegular + dashboardData.countUnassignedEmpContractual}</div>
            <Tooltip
          title={
            <div className={styles.tooltipContent}>
            <span>Regular:{dashboardData.countUnassignedEmpRegular} </span>
              <br />
              <span>Trainee:{dashboardData.countUnassignedEmpTrainee}</span>
              <br />
              <span>Intern:{dashboardData.countUnassignedEmpIntern}</span>
              <br />
              <span>Business Partner:{dashboardData.countUnassignedEmpContractual}</span>
            </div>
          }
          arrow
        >
          <div className={styles.cardtitle}>WITHOUT ASSIGNED SEATS</div>
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
             
                  <List>
      {com.map((comment, index) => (
        <React.Fragment key={index}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar alt={comment.full_name} src="/static/images/avatar.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={
                <>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.primary"
                    fontWeight="bold"
                  >
                    {comment.full_name}
                  </Typography>
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    <div>{formatTime(comment.created_time)} Located at Seat No.{comment.seat_id}</div>
                  </Typography>
                </>
              }
              secondary={
                <Typography
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {comment.comment}
                </Typography>
              }
            />
          </ListItem>
          {index !== com.length - 1 && <Divider variant="inset" component="li" />}
        </React.Fragment>
      ))}
    </List>
                  
                  </div>
            </div>
            <div className={styles.projectCard}>
            <div className={styles.cardtitle2}>SUMMARY</div>
            <div className={styles.projectcontent}>
              
            <TableContainer component={Paper} sx={{ width: '100%', height: 400 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Seats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projectSummary
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((project) => (
                <TableRow key={project.project_name}>
                  <TableCell >{project.project_name}</TableCell>
                  <TableCell>{project.seatCount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={projectSummary.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      /></div>
      
      </div>
            </div>
            
          </div>
        </div>
        
    
        
        </body>
      </>
    );
  };

  export default DashboardPage;


