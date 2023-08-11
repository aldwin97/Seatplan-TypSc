import React, { useState, ChangeEvent, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import style from "../dashboard_component/dashboardPage.module.css";
import {
  DashboardOutlined,
  ChairOutlined,
  GroupsOutlined,
  AccountCircleOutlined,
  WorkOutlineOutlined,
  BusinessCenterOutlined,
  Menu,
  Logout,
} from "@mui/icons-material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./profilePage.module.css";
import profileBackg from "./assets/profileBackg.png";
import defaulImage from "../assets/default.png";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import axios, { AxiosError } from "axios";
import Grid from "@mui/material/Grid";
import { Avatar} from '@mui/material';
const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  const [isDrawerOpen, setDrawerOpen] = useState(false);

  const [editPersonalMode, setPersonalEditMode] = useState(false);
  const [editAccountMode, setAccountEditMode] = useState(false);
  const [UserData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [userPicture, setUserPicture] = useState("");
  const [userPicture1, setUserPicture1] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [response, setResponse] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState("");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [isPersonalFormValidSnackbar, setPersonalFormValidSnackbar] =
    useState(false);
  const [isPersonalFormValid, setPersonalFormValid] = useState(true);
  const [isContactNumberError, setContactNumberError] = useState(false);
  const [contactNumberLengthError, setContactNumberLengthError] =
    useState(false);
  const MAX_CONTACT_NUMBER_LENGTH = 11;
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");

  const [savedPersonalInfo, setSavedPersonalInfo] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    ContactNumber: "",
  });

  const [inputValues, setInputValues] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    ContactNumber: "",
  });

  const [accountValues, setAccountValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [initialAccountValues, setInitialAccountValues] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  interface UserProfile {
    first_name: string;
    last_name: string;
    position_name: string;
    username: string;
  }

  interface UserModel {
    oldPassword: string;
    newPassword: string;
    password: string;
  }

  interface ErrorResponse {
    message: string;
    status: number;
  }
  interface UserData {
    first_name: string;
    last_name: string;
    position_name: string;
  }

  useEffect(() => {
    const fetchUserPicture = async () => {
      try {
        const user_id = window.sessionStorage.getItem('user_id');
        const pictureResponse = await axios.get(`http://localhost:8080/profile/userPicture/${user_id}`, {
          responseType: 'arraybuffer',
        });

        const base64Data = btoa(
          new Uint8Array(pictureResponse.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
          )
        );
        const pictureDataUrl = `data:${pictureResponse.headers['content-type'].toLowerCase()};base64,${base64Data}`;
        setUserPicture1(pictureDataUrl);
      } catch (error) {
        console.error('Error fetching profile picture:', error);
      }
    };

    fetchUserPicture();
  }, []);

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
    const user_id = window.sessionStorage.getItem("user_id");

    const fetchProfileData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/profile/showLogedUserInfo/${user_id}`
        );

        const responseData = response.data[0];

        const contactNumberInt = parseInt(responseData.mobile_num, 10);

        setInputValues({
          FirstName: responseData.first_name,
          LastName: responseData.last_name,
          Email: responseData.email,
          ContactNumber: "0" + contactNumberInt.toString(),
        });

        setSavedPersonalInfo({
          FirstName: responseData.first_name,
          LastName: responseData.last_name,
          Email: responseData.email,
          ContactNumber: "0" + contactNumberInt.toString(),
        });

        setProfileData({
          first_name: responseData.first_name,
          last_name: responseData.last_name,
          position_name: responseData.position_name,
          username: responseData.username,
        });

        try {
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
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return null;
  }

  const viewSeatPageHandleClick = () => {
    navigate("/seatPlanPage");
  };
  const toggleOldPasswordVisibility = () => {
    setShowOldPassword((prevShow) => !prevShow);
  };

  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prevShow) => !prevShow);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prevShow) => !prevShow);
  };

  const logInPageHandleClick = (): void => {
    navigate("/");
  };

  // PERSONAL INFORMATION BUTTONS //

  const handlePersonalSaveChanges = async () => {
    const isPersonalInfoValid = validatePersonalInfo();

    if (isPersonalInfoValid) {
      const contactNumber = inputValues.ContactNumber;

      if (isNaN(Number(contactNumber))) {
        setContactNumberError(true);
        setContactNumberLengthError(false);
        return;
      }

      if (contactNumber.length !== MAX_CONTACT_NUMBER_LENGTH) {
        setContactNumberError(false);
        setContactNumberLengthError(true);
        return;
      }

      // If the code reaches this point, it means the contact number is valid.
      setContactNumberError(false);
      setContactNumberLengthError(false);
      try {
        const user_id = window.sessionStorage.getItem("user_id");

        const updatedUser = {
          first_name: inputValues.FirstName,
          last_name: inputValues.LastName,
          email: inputValues.Email,
          mobile_num: inputValues.ContactNumber,
        };

        const response = await axios.put(
          `http://localhost:8080/profile/updatePersonalInfo/${user_id}`,
          updatedUser
        );

        if (response.status === 200) {
          setSavedPersonalInfo({ ...inputValues });

          setProfileData({
            ...profileData,
            first_name: inputValues.FirstName,
            last_name: inputValues.LastName,
          });

          setPersonalEditMode(false);
          setPersonalFormValid(true);
        } else {
          // Handle other response status codes here if needed
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          setEmailError(
            "Email already exists. Please choose a different email address."
          );
        } else {
          setEmailError("Error updating user. Please try again later.");
        }
      }
    } else {
      setPersonalFormValid(false);
    }
  };

  const handlePersonalCancelChanges = () => {
    setInputValues(savedPersonalInfo);
    setPersonalEditMode(false);
    setPersonalFormValid(true);
  };

  const handlePersonalEditClick = () => {
    setPersonalEditMode(true);
  };

  // ACCOUNT SETTINGS BUTTON //

  const handleAccountSaveChanges = async () => {
    const user_id = window.sessionStorage.getItem("user_id");
    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        setSnackbarSeverity("error");
        setSnackbarMessage("All password fields are required.");
        setSnackbarOpen(true);
        return;
      }

      if (oldPassword.trim() === newPassword.trim()) {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          "New password should be different from the old password."
        );
        setSnackbarOpen(true);
        return;
      }

      if (newPassword.trim() !== confirmPassword.trim()) {
        setSnackbarSeverity("error");
        setSnackbarMessage("New and confirm passwords do not match.");
        setSnackbarOpen(true);
        return;
      }

      if (/\s/.test(newPassword) || /\s/.test(confirmPassword)) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Spaces are not allowed in the passwords.");
        setSnackbarOpen(true);
        return;
      }

      const requestData: UserModel = {
        oldPassword,
        newPassword,
        password: confirmPassword,
      };

      const response = await axios.put(
        `http://localhost:8080/profile/updatePassword/${user_id}`,
        requestData
      );

      if (response.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Password updated successfully");
        setSnackbarOpen(true);
        handleAccountCancelChanges();
      } else {
        setResponse("Failed to update password");
      }
    } catch (error: any) {
      if (error?.response?.status === 401) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Incorrect old password");
        setSnackbarOpen(true);
      } else {
        const axiosError = error as AxiosError<ErrorResponse>;
        if (axiosError?.response?.data?.message) {
          setSnackbarSeverity("error");
          setSnackbarMessage(axiosError.response.data.message);
          setSnackbarOpen(true);
        } else {
          setSnackbarSeverity("error");
          setSnackbarMessage("An error occurred while updating the user");
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleAccountCancelChanges = (): void => {
    setAccountValues({ ...initialAccountValues });
    setAccountValues(initialAccountValues);
    setAccountEditMode(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAccountEditClick = () => {
    setInitialAccountValues({ ...accountValues });
    setAccountEditMode(true);
  };

  // INPUTS

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: String(value),
    }));
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const user_picture = event.target.files?.[0];
    event.target.value = "";
    if (user_picture) {
      if (
        !user_picture.type.startsWith("image/") ||
        !/\.(jpg|jpeg|png)$/i.test(user_picture.name)
      ) {
        setErrorMsg(
          "File not supported. Please upload an image file (jpg, jpeg, or png)."
        );
        return;
      }

      const maxFileSize = 5 * 1024 * 1024;
      if (user_picture.size > maxFileSize) {
        setErrorMsg("File size exceeds the maximum limit (5 MB).");
        return;
      }

      const formData = new FormData();
      formData.append("user_picture", user_picture);

      const userId = sessionStorage.getItem("user_id");

      try {
        const response = await axios.put(
          `http://localhost:8080/profile/updatePicture/${userId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Upload successful:", response.data);
        window.location.reload();
      } catch (error) {
        console.error("Error uploading image:", error);
        setErrorMsg("File size is too big.");
      }
    }
  };

  const validatePersonalInfo = () => {
    const { FirstName, LastName, Email, ContactNumber } = inputValues;
    const isFirstNameValid = FirstName.trim() !== "";
    const isLastNameValid = LastName.trim() !== "";
    const isEmailValid = Email.trim() !== "";
    const isContactNumberValid = ContactNumber.trim() !== "";
    return (
      isFirstNameValid &&
      isLastNameValid &&
      isEmailValid &&
      isContactNumberValid
    );
  };

  const handlePersonalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPersonalFormValid) {
      console.log("Personal Form Valid");
      setPersonalFormValidSnackbar(true);
    } else {
      console.log("Personal Form Invalid");
    }
  };

  // SNACKBAR

  const handleImageSnackbarClose = () => {
    setErrorMsg(null);
  };

  const handleSnackbarClose = () => {
    setPersonalFormValid(true);
    setPersonalFormValidSnackbar(false);
  };

  const handleSnackbarPasswordClose = () => {
    setSnackbarOpen(false);
  };

  const handleEmailSnackbarClose = () => {
    setEmailError(""); // Clear the emailError state when the Snackbar is closed
  };

  //sidebar

  const toggleDrawer = () => {
    setDrawerOpen(!isDrawerOpen);
  };
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

  const handleLogout = () => {
    sessionStorage.removeItem("user_id");
    navigate("/");
  };

  const capitalizeFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  return (
    <div className={styles.backg}>
      <i className={style["menu-out"]} onClick={toggleDrawer}>
        <Menu style={{ fontSize: "28px" }} />
      </i>

      <SwipeableDrawer
        anchor="left"
        open={isDrawerOpen}
        onClose={toggleDrawer}
        onOpen={toggleDrawer}
        variant="persistent"
        className={
          isDrawerOpen ? style["sidebar-open"] : style["sidebar-closed"]
        }
      >
        <div className={style["page-sidebar"]}>
          <div className={style["logo-box"]}>
            <span className={style["logo-text"]}>Seat</span>
            <i className={style["menu"]} onClick={toggleDrawer}>
              <Menu style={{ fontSize: "28px" }} />
            </i>
            <div
              className={`${style["page-sidebar-inner"]} ${style["slimscroll"]}`}
            >
              <ul className={style["accordion-menu"]}>
                     <div className="accordion-menu-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className={style['userbg']}>
                      <div className={style['userpr']}>
                      {userPicture ? (
      <Avatar src={userPicture} alt="User" />
    ) : (
      <img
      src={defaulImage}
      alt="Profile Default"
      className={style.defaultImage}// Add any additional styles here
      />
    )}
                      </div>
                    </div>
                    {UserData ? (
                      <div className={style['usern']}>
                        {UserData.first_name}  {UserData.last_name} 
                          <div className={style['userp']}>{UserData.position_name}</div>
                      </div>
          
                    ) : (
                      <div></div>
                    )}
                  </div>
                <li className={style["sidebar-title"]}>Apps</li>
                <li>
                  <a
                    onClick={dashboardPageHandleClick}
                    className={style["material-icons"]}
                  >
                    <i className={styles["material-icons"]}>
                      <DashboardOutlined />
                    </i>
                    Dashboard
                  </a>
                </li>
                <li className={style["active-page"]}>
                  <a
                    onClick={ProfilePageHandleClick}
                    className={style["material-icons"]}
                  >
                    <i
                      className={`${style["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <AccountCircleOutlined />
                    </i>
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    onClick={projectPageHandleClick}
                    className={style["material-icons"]}
                  >
                    <i
                      className={`${style["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <WorkOutlineOutlined />
                    </i>
                    Project
                  </a>
                </li>
                <li>
                    <a onClick={MachinePageHandleClick} className={styles['material-icons']}>
                      <i className={`${styles['material-icons-outlined']} ${styles['material-icons']}`}>
                        <BusinessCenterOutlined/>
                      </i>
                      Machine 
                    </a>
                  </li>
                <li>
                  <a onClick={adminPageHandleClick} className={style["active"]}>
                    <i
                      className={`${style["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <GroupsOutlined />
                    </i>
                    Members
                  </a>
                </li>
                <li>
                  <a
                    onClick={SeatplanPageHandleClick}
                    className={style["material-icons"]}
                  >
                    <i
                      className={`${style["material-icons-outlined"]} ${styles["material-icons"]}`}
                    >
                      <ChairOutlined />
                    </i>
                    Seat
                  </a>
                </li>
                <li>
                  <a onClick={handleLogout} className={style["material-icons"]}>
                    <i
                      className={`${style["material-icons-outlined"]} ${styles["material-icons"]}`}
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
        <div className={styles.form1}>
          {/* Display Container */}
          <form className={styles.profileSum}>
            <div className={styles.cover}>
              <img
                className={styles["resizable-image"]}
                src={profileBackg}
                alt="Profile Background"
              />
            </div>

            <div className={styles.inputDisplay}>
              <h3>
                {profileData.first_name}{" "}
                {capitalizeFirstLetter(profileData.last_name)}
              </h3>
              <h4>{profileData.position_name}</h4>
            </div>

            <div className={styles.profilePicture}>
              <Snackbar
                open={!!errorMsg}
                autoHideDuration={5000}
                onClose={handleImageSnackbarClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={handleImageSnackbarClose}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  {errorMsg}
                </MuiAlert>
              </Snackbar>

              {userPicture ? (
                <img src={userPicture} alt="User Profile Picture" />
              ) : (
                <img
                  src={defaulImage}
                  alt="Profile Default"
                  className={styles.defaultImage}
                />
              )}
              <label htmlFor="file" className={styles.uploadButton}>
                <AddAPhotoIcon />
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileUpload}
                className={styles.input}
                style={{ display: "none" }}
              />
            </div>
          </form>

          <div className={styles.set}>
            {/* PERSONAL INFORMATION CONTAINER */}
            <form className={styles.personal} onSubmit={handlePersonalSubmit}>
              <div className={styles.line}></div>
              <h1>Personal Information</h1>
              <div className={styles["name-group"]}>
                <label className={styles.readLabel}>First Name *</label>
                <input
                  required
                  type="text"
                  name="FirstName"
                  autoComplete="off"
                  className={styles.nameInput}
                  readOnly={!editPersonalMode}
                  value={inputValues.FirstName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles["name-group"]}>
                <label className={styles.readLabel}>Last Name *</label>
                <input
                  required
                  type="text"
                  name="LastName"
                  autoComplete="off"
                  className={styles.nameInput}
                  readOnly={!editPersonalMode}
                  value={inputValues.LastName}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles["input-group"]}>
                <label className={styles.readLabel2}>Email Address *</label>
                <input
                  required
                  type="text"
                  name="Email"
                  autoComplete="off"
                  className={styles.input}
                  readOnly={!editPersonalMode}
                  value={inputValues.Email}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles["input-group1"]}>
                <label className={styles.readLabel3}>Mobile Number *</label>
                <input
                  required
                  type="text"
                  name="ContactNumber"
                  autoComplete="off"
                  className={styles.input}
                  readOnly={!editPersonalMode}
                  value={inputValues.ContactNumber}
                  onChange={handleInputChange}
                />
              </div>
              <Snackbar
                open={!isPersonalFormValid}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={handleSnackbarClose}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  Please fill in all the required fields.
                </MuiAlert>
              </Snackbar>
              <Snackbar
                open={!!emailError}
                autoHideDuration={5000}
                onClose={handleEmailSnackbarClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={handleEmailSnackbarClose}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  {emailError}
                </MuiAlert>
              </Snackbar>

              <Snackbar
                open={isContactNumberError}
                autoHideDuration={5000}
                onClose={() => setContactNumberError(false)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => setContactNumberError(false)}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  Contact number must be a number.
                </MuiAlert>
              </Snackbar>

              <Snackbar
                open={contactNumberLengthError}
                autoHideDuration={5000}
                onClose={() => setContactNumberLengthError(false)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => setContactNumberLengthError(false)}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  Contact number should be {MAX_CONTACT_NUMBER_LENGTH} digits
                  long.
                </MuiAlert>
              </Snackbar>

              {editPersonalMode ? (
                <div className={styles["personal-button"]}>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handlePersonalSaveChanges}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handlePersonalCancelChanges}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Tooltip
                  title="Edit"
                  placement="top"
                  arrow
                  // className={styles.settool}
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    backgroundColor: "#797979",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "40px",
                    padding: "8px",
                    // top:"-320px",
                    // left:"820px",
                    cursor: "pointer",
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border-color 0.4s ease-in-out",
                  }}
                >
                  <IconButton onClick={handlePersonalEditClick}>
                    <ManageAccountsSharpIcon />
                  </IconButton>
                </Tooltip>
              )}
            </form>

            {/* ACCOUNT SETTINGS CONTAINER */}
            <form className={styles.accountS}>
              <div className={styles.line}></div>
              <h1>Account Settings</h1>
              <div className={styles["input-group"]}>
                <label className={styles.readLabel2}>Username</label>
                <input
                  required
                  className={styles.input}
                  readOnly={true}
                  value={profileData.username}
                />
              </div>
              <div className={styles["input-group2"]}>
                <label htmlFor="oldPassword" className={styles.readLabel4}>
                  {" "}
                  Old Password{" "}
                </label>
                <input
                  required
                  type={
                    editAccountMode
                      ? showOldPassword
                        ? "text"
                        : "password"
                      : "password"
                  }
                  id="oldPassword"
                  autoComplete="off"
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={styles.input}
                  value={oldPassword}
                  readOnly={!editAccountMode}
                />

                {editAccountMode && (
                  <span
                    className={`${styles["toggle-password"]} ${
                      showOldPassword ? styles.active : ""
                    }`}
                    onClick={toggleOldPasswordVisibility}
                  >
                    {showOldPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                )}
              </div>
              <div className={styles["change-group"]}>
                <label htmlFor="newPassword" className={styles.readLabel}>
                  New Password
                </label>
                <input
                  required
                  type={
                    editAccountMode
                      ? showNewPassword
                        ? "text"
                        : "password"
                      : "password"
                  }
                  id="newPassword"
                  autoComplete="off"
                  className={styles.changeInput}
                  readOnly={!editAccountMode}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />

                {editAccountMode && (
                  <span
                    className={`${styles["toggle-password1"]} ${
                      showNewPassword ? styles.active : ""
                    }`}
                    onClick={toggleNewPasswordVisibility}
                  >
                    {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                )}
              </div>
              <div className={styles["change-group"]}>
                <label className={styles.readLabel}>Confirm Password</label>
                <input
                  required
                  type={
                    editAccountMode
                      ? showConfirmPassword
                        ? "text"
                        : "password"
                      : "password"
                  }
                  name="confirmPassword"
                  autoComplete="off"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={styles.changeInput}
                  readOnly={!editAccountMode}
                />

                {editAccountMode && (
                  <span
                    className={`${styles["toggle-password1"]} ${
                      showConfirmPassword ? styles.active : ""
                    }`}
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                )}
              </div>
              <Snackbar
                open={!!successMessage}
                autoHideDuration={5000}
                onClose={() => setSuccessMessage(null)}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => setSuccessMessage(null)}
                  severity="success"
                  sx={{ width: "290px" }}
                >
                  {successMessage}
                </MuiAlert>
              </Snackbar>
              <Snackbar
                open={!!oldPasswordError}
                autoHideDuration={5000}
                onClose={() => setOldPasswordError("")}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={1}
                  variant="filled"
                  onClose={() => setOldPasswordError("")}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  {oldPasswordError}
                </MuiAlert>
              </Snackbar>
              <Snackbar
                open={!!newPasswordError}
                autoHideDuration={5000}
                onClose={() => setNewPasswordError("")}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={() => setNewPasswordError("")}
                  severity="error"
                  sx={{ width: "290px" }}
                >
                  New password should be different from the old password.
                </MuiAlert>
              </Snackbar>
              <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarPasswordClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <MuiAlert
                  elevation={6}
                  variant="filled"
                  onClose={handleSnackbarPasswordClose}
                  severity={snackbarSeverity}
                  sx={{ width: "290px" }}
                >
                  {snackbarMessage}
                </MuiAlert>
              </Snackbar>
              ;
              {editAccountMode ? (
                <div className={styles["account-button"]}>
                  <button
                    type="button"
                    className={styles.saveButton}
                    onClick={handleAccountSaveChanges}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={handleAccountCancelChanges}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <Tooltip
                  title="Edit"
                  placement="top"
                  arrow
                  
                  style={{
                    position: "absolute",
                    top: "24px",
                    right: "24px",
                    backgroundColor: "#797979",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "40px",
                    padding: "8px",
                    // top: "-250px",
                    marginLeft: "-3%",
                    cursor: "pointer",
                    transition:
                      "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border-color 0.4s ease-in-out",
                  }}
                >
                  <IconButton onClick={handleAccountEditClick}className={styles.settool1}>
                    <ManageAccountsSharpIcon />
                  </IconButton>
                </Tooltip>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
