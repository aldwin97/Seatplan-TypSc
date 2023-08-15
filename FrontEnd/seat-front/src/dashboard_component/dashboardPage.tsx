import React, { useState, useEffect, useRef } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import {
  Tooltip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Typography,
  ListItemAvatar,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import styles from "./dashboardPage.module.css";
import {
  BusinessCenterOutlined,
  DashboardOutlined,
  ChairOutlined,
  GroupsOutlined,
  AccountCircleOutlined,
  WorkOutlineOutlined,
  Menu,
  Logout,
  GroupsRounded,
  PeopleOutlineRounded,
  Diversity3Rounded,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import axios from "axios";
import "chartjs-plugin-datalabels";
import occupied from "./asset/occupied.png";
import available from "./asset/available.png";
import totalseat from "./asset/totalseat.png";
import { Grid, Box } from "@mui/material";
import defaulImage from "../assets/default.png";

interface ProjectSummary {
  project_name: string;
  seatCount: number;
}

const DashboardPage: React.FC = () => {
  const [userPicture, setUserPicture] = useState<string | null>(null);
  const [com, setComments] = useState<Comments[]>([]);
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleLogout = () => {
    // Clear any user-related data from the session/local storage
    sessionStorage.removeItem('user_id');


    // Redirect to the login page
    navigate("/");
  };

  interface CommentCardProps {
    com: Comments[];
  }

  interface Comments {
    full_name: string;
    comment: string;
    created_time: string;
    seat_id: number;
  }

  interface UserData {
    first_name: string;
    last_name: string;
    position_name: string;
  }

  useEffect(() => {
    const fetchUserPicture = async () => {
      try {
        const user_id = window.sessionStorage.getItem("user_id");
        const pictureResponse = await axios.get(
          `http://localhost:8080/profile/userPicture/${user_id}`,
          {
            responseType: "arraybuffer",
          }
        );

        const base64Data = btoa(
          new Uint8Array(pictureResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        const pictureDataUrl = `data:${pictureResponse.headers[
          "content-type"
        ].toLowerCase()};base64,${base64Data}`;
        setUserPicture(pictureDataUrl);
      } catch (error) {
        console.error("Error fetching profile picture:", error);
      }
    };

    fetchUserPicture();
  }, []);

  useEffect(() => {
    const user_id = window.sessionStorage.getItem("user_id");

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/dashboard/showLogedUserInfo/${user_id}`
        );

        const responseData: UserData = response.data[0];
        setUserData(responseData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Fetch the data from the endpoint
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/dashboard/showAllComment"
        );
        const data: Comments[] = response.data;

        setComments(data);
      } catch (error) {
        console.error("Error fetching showAllComment:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/dashboard/display"
        );
        if (response && response.data) {
          setDashboardData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (myChart.current) {
          myChart.current.destroy();
        }

        myChart.current = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Occupied", "Available", "Under Repair"],
            datasets: [
              {
                label: "Seat Conditions",
                data: [
                  dashboardData.countOccupied,
                  dashboardData.countSeatAvailable,
                  dashboardData.countUnderMaintenance,
                ],
                backgroundColor: [
                  "rgba(47, 167, 58, 0.5)",
                  "rgba(47, 167, 58, 0.5)",
                  "rgba(47, 167, 58, 0.5)",
                ],
                borderColor: "#2FA73A",
                borderWidth: 2,
              },
            ],
          },
          options: {
            indexAxis: "x",
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
                anchor: "end",
                align: "top",
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
  });
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
  const navigate = useNavigate();
  const MachinePageHandleClick = () => {
    navigate("/machinetablePage");
  };
  const projectPageHandleClick = () => {
    navigate("/ProjectPage");
  };
  const dashboardPageHandleClick = () => {
    navigate("/DashboardPage");
  };
  const adminPageHandleClick = () => {
    navigate("/AdminPage");
  };
  const ProfilePageHandleClick = () => {
    navigate("/ProfilePage");
  };
  const SeatplanPageHandleClick = () => {
    navigate("/seatPlanPage");
  };

  /*table for project overview*/
  useEffect(() => {
    const fetchProjectSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/dashboard/countPerProject"
        );
        const data = response.data;

        // Set the project summary state with the fetched data
        setProjectSummary(data);
      } catch (error) {
        console.error("Error fetching project summary data:", error);
      }
    };

    // Call the function to fetch project summary data
    fetchProjectSummary();
  }, []);

  const formatTime = (isoDate: string): string => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <>
      <body>
        <Box>
          <i className={styles["menu-out"]} onClick={toggleDrawer}>
            <Menu style={{ fontSize: "28px" }} />
          </i>

          <SwipeableDrawer
            anchor="left"
            open={isDrawerOpen}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}
            variant="persistent"
            className={
              isDrawerOpen ? styles["sidebar-open"] : styles["sidebar-closed"]
            }
          >
            <div className={styles["page-sidebar"]}>
              <div className={styles["logo-box"]}>
                <span className={styles["logo-text"]}>Seat</span>
                <i className={styles["menu"]} onClick={toggleDrawer}>
                  <Menu style={{ fontSize: "28px" }} />
                </i>
                <div
                  className={`${styles["page-sidebar-inner"]} ${styles["slimscroll"]}`}
                >
                  <ul className={styles["accordion-menu"]}>
                    <div
                      className="accordion-menu-container"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div className={styles["userbg"]}>
                        <div className={styles["userpr"]}>
                          {userPicture ? (
                            <Avatar src={userPicture} alt="User" />
                          ) : (
                            <img
                              src={defaulImage}
                              alt="Profile Default"
                              className={styles.defaultImage} // Add any additional styles here
                            />
                          )}
                        </div>
                      </div>
                      {UserData ? (
                        <div className={styles["usern"]}>
                          {UserData.first_name} {UserData.last_name}
                          <div className={styles["userp"]}>
                            {UserData.position_name}
                          </div>
                        </div>
                      ) : (
                        <div></div>
                      )}
                    </div>

                    <li className={styles["sidebar-title"]}>Apps</li>
                    <li className={styles["active-page"]}>
                      <a
                        onClick={dashboardPageHandleClick}
                        className={styles["active"]}
                      >
                        <i className={styles["material-icons"]}>
                          <DashboardOutlined />
                        </i>
                        Dashboard
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={ProfilePageHandleClick}
                        className={styles["material-icons"]}
                      >
                        <i
                          className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                        >
                          <AccountCircleOutlined />
                        </i>
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={projectPageHandleClick}
                        className={styles["material-icons"]}
                      >
                        <i
                          className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                        >
                          <WorkOutlineOutlined />
                        </i>
                        Project
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={MachinePageHandleClick}
                        className={styles["material-icons"]}
                      >
                        <i
                          className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                        >
                          <BusinessCenterOutlined />
                        </i>
                        Machine
                      </a>
                    </li>

                    <li>
                      <a
                        onClick={adminPageHandleClick}
                        className={styles["material-icons"]}
                      >
                        <i
                          className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                        >
                          <GroupsOutlined />
                        </i>
                        Members
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={SeatplanPageHandleClick}
                        className={styles["material-icons"]}
                      >
                        <i
                          className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                        >
                          <ChairOutlined />
                        </i>
                        Seat
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={handleLogout}
                        className={styles["material-icons"]}
                      >
                        <i
                          className={`${styles["material-icons-outlined"]} ${styles["material-icons"]}`}
                        >
                          <Logout />
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
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
                className={styles.mainContainer}
              >
                <Box className={styles.cardHello}>
                  <svg className={styles.Helloimg}></svg>
                  {UserData ? (
                    <div className={styles.Hellotitle}>
                      {UserData.first_name} {UserData.last_name}
                      <div className={styles.Hellotitle1}>
                        {UserData.position_name}
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}
                </Box>
              </Grid>
              <div className={styles.countcontainer}>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles.cardContainer}
                >
                  <Box className={styles.card1}>
                    <div className={styles.cardicon}>
                      <img src={totalseat} />
                    </div>
                    <div className={styles.cardcount}>
                      {dashboardData.countOccupied +
                        dashboardData.countSeatAvailable +
                        dashboardData.countUnderMaintenance}
                    </div>
                    <div className={styles.cardtitle}>TOTAL SEATS</div>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles.cardContainer}
                >
                  <Box className={styles.card2}>
                    <div className={styles.cardicon}>
                      <img src={occupied} />
                    </div>
                    <div className={styles.cardcount}>
                      {dashboardData.countOccupied}
                    </div>
                    <div className={styles.cardtitle}>OCCUPIED SEATS</div>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles.cardContainer}
                >
                  <Box className={styles.card3}>
                    <div className={styles.cardicon}>
                      <img src={available} />
                    </div>
                    <div className={styles.cardcount}>
                      {dashboardData.countSeatAvailable}
                    </div>
                    <div className={styles.cardtitle}>AVAILABLE SEATS</div>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles.cardContainer}
                >
                  <Box className={styles.card4}>
                    <div className={styles.cardicon}>
                      <GroupsRounded style={{ fontSize: 42 }} />
                    </div>
                    <div className={styles.cardcount}>
                      {dashboardData.countUser}
                    </div>
                    <div className={styles.cardtitle}>TOTAL ASSOCIATES</div>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles.cardContainer}
                >
                  <Box className={styles.card5}>
                    <div className={styles.cardicon}>
                      <Diversity3Rounded style={{ fontSize: 42 }} />
                    </div>
                    <div className={styles.cardcount}>
                      {dashboardData.countAssignedEmpIntern +
                        dashboardData.countAssignedEmpTrainee +
                        dashboardData.countAssignedEmpRegular +
                        dashboardData.countAssignedEmpContractual}{" "}
                    </div>
                    <Tooltip
                      title={
                        <div className={styles.tooltipContent}>
                          <span>
                            Regular:{dashboardData.countAssignedEmpRegular}{" "}
                          </span>
                          <br />
                          <span>
                            Trainee:{dashboardData.countAssignedEmpTrainee}
                          </span>
                          <br />
                          <span>
                            Intern:{dashboardData.countAssignedEmpIntern}
                          </span>
                          <br />
                          <span>
                            Business Partner:
                            {dashboardData.countAssignedEmpContractual}
                          </span>
                        </div>
                      }
                      arrow
                    >
                      <div className={styles.cardtitle}>
                        WITH ASSIGNED SEATS
                      </div>
                    </Tooltip>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  className={styles.cardContainer}
                >
                  <Box className={styles.card6}>
                    <div className={styles.cardicon}>
                      <PeopleOutlineRounded style={{ fontSize: 42 }} />
                    </div>
                    <div className={styles.cardcount}>
                      {dashboardData.countUnassignedEmpIntern +
                        dashboardData.countUnassignedEmpTrainee +
                        dashboardData.countUnassignedEmpRegular +
                        dashboardData.countUnassignedEmpContractual}
                    </div>
                    <Tooltip
                      title={
                        <div className={styles.tooltipContent}>
                          <span>
                            Regular:{dashboardData.countUnassignedEmpRegular}{" "}
                          </span>
                          <br />
                          <span>
                            Trainee:{dashboardData.countUnassignedEmpTrainee}
                          </span>
                          <br />
                          <span>
                            Intern:{dashboardData.countUnassignedEmpIntern}
                          </span>
                          <br />
                          <span>
                            Business Partner:
                            {dashboardData.countUnassignedEmpContractual}
                          </span>
                        </div>
                      }
                      arrow
                    >
                      <div className={styles.cardtitle}>
                        WITHOUT ASSIGNED SEATS
                      </div>
                    </Tooltip>
                  </Box>
                </Grid>
              </div>

              <Grid item xs={12} className={styles.chartContainer}>
                <Box className={styles.cardseat}>
                  <div className={styles.cardtitle1}>SEAT CONDITIONS </div>
                  <div className={styles.chartcontainer}>
                    <canvas
                      ref={chartRef}
                      style={{ height: `${chartHeight}px`, marginTop: "55px" }}
                    />
                  </div>
                </Box>
              </Grid>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
                className={styles.mainContainer}
              >
                <Box className={styles.commentContainer}>
                  <div className={styles.cardcomment}>
                    <div className={styles.cardtitle3}>RECENT COMMENT</div>
                    <div className={styles.commentcontent}>
                      <List>
                        {com.map((comment, index) => (
                          <React.Fragment key={index}>
                            <ListItem alignItems="flex-start">
                              <ListItemAvatar>
                                <Avatar
                                  alt={comment.full_name}
                                  src="/static/images/avatar.jpg"
                                />
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
                                      <div>
                                        {formatTime(comment.created_time)}{" "}
                                        Located at Seat No.{comment.seat_id}
                                      </div>
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
                            {index !== com.length - 1 && (
                              <Divider variant="inset" component="li" />
                            )}
                          </React.Fragment>
                        ))}
                      </List>
                    </div>
                  </div>
                </Box>
              </Grid>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
                className={styles.mainContainer}
              >
                <Box className={styles.projectCardContainer}>
                  <div className={styles.projectCard}>
                    <div className={styles.cardtitle3}>SUMMARY</div>
                    <div className={styles.projectcontent}>
                      <TableContainer
                        component={Paper}
                        sx={{ width: "100%", height: 400 }}
                      >
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                <div className={styles.cardtitle2}>
                                  Project Name
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className={styles.cardtitle2}>Seats</div>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {projectSummary
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((project) => (
                                <TableRow key={project.project_name}>
                                  <TableCell>
                                    <div className={styles.cardtext}>
                                      {project.project_name}
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <div className={styles.cardtext}>
                                      {project.seatCount}
                                    </div>
                                  </TableCell>
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
                      />
                    </div>
                  </div>
                </Box>
              </Grid>
            </div>
          </div>
        </Box>
      </body>
    </>
  );
};

export default DashboardPage;
