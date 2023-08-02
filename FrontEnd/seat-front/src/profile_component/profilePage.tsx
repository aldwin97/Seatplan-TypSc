import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import style from "../dashboard_component/dashboardPage.module.css";
import {
  DashboardOutlined,
  ChairOutlined,
  GroupsOutlined,
  AccountCircleOutlined,
  WorkOutlineOutlined,
  Menu,
  Logout,
} from "@mui/icons-material";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./profilePage.module.css";
import profileBackg from "./assets/profileBackg.jpg";
import defaulImage from "../assets/default.png";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"; // Added import
import axios from "axios";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [editPersonalMode, setPersonalEditMode] = useState(false);
  const [editAccountMode, setAccountEditMode] = useState(false);
  const [isPersonalFormValidSnackbar, setPersonalFormValidSnackbar] =
    useState(false);
  const [passwordMismatchSnackbar, setPasswordMismatchSnackbar] =
    useState(false);
  const [isPersonalFormValid, setPersonalFormValid] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // Change the state type to string | null
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [userPicture, setUserPicture] = useState("");

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
    email: string;
    position_name: string;
    username: string;
    mobile_num: string;
  }

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
          ContactNumber: contactNumberInt.toString(),
        });

        setSavedPersonalInfo({
          FirstName: responseData.first_name,
          LastName: responseData.last_name,
          Email: responseData.email,
          ContactNumber: contactNumberInt.toString(),
        });

        setProfileData({
          first_name: responseData.first_name,
          last_name: responseData.last_name,
          email: responseData.email,
          position_name: responseData.position_name,
          username: responseData.username,
          mobile_num: responseData.mobile_num,
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
            email: inputValues.Email,
            mobile_num: inputValues.ContactNumber,
          });

          setPersonalEditMode(false);
          setPersonalFormValid(true);
        } else {
          console.error("Error updating user:", response.data);
        }
      } catch (error) {
        console.error("Error updating user:", error);
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

  const handleAccountSaveChanges = (): void => {
    const { newPassword, confirmPassword } = accountValues;
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match.");
      setPasswordMismatchSnackbar(true);
    } else {
      setConfirmPasswordError("");
      setAccountEditMode(false);
    }
  };

  const handleAccountCancelChanges = (): void => {
    setAccountValues({ ...initialAccountValues });
    setConfirmPasswordError("");
    setPasswordMismatchSnackbar(false);
    setAccountEditMode(false);
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

  const handleAccountInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccountValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChangeAndUpload = async (
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
        setErrorMsg("Error uploading image. Please try again later.");
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
      console.log("yes");
      setPersonalFormValidSnackbar(true);
    } else {
      console.log("no");
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

  const handleAccountSnackbarClose = () => {
    setPasswordMismatchSnackbar(false);
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
      <div className={styles.form1}>
        {/* Left Container */}
        <form className={styles.profileSum}>
          <div className={styles.cover}>
            <img src={profileBackg} alt="Profile Background" />
          </div>

          <div className={styles.inputDisplay}>
            <h3>
              {profileData.first_name} {profileData.last_name}
            </h3>
            <h4>{profileData.position_name}</h4>
            <h5>{profileData.username}</h5>
            <h5>{profileData.email}</h5>
            <h5>{profileData.mobile_num}</h5>
          </div>

          <button
            type="button"
            className={styles.seatButton}
            onClick={viewSeatPageHandleClick}
          >
            View Seatplan
          </button>

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
                src={defaulImage} // Provide the path to your default image here
                alt="Profile"
                className={styles.defaultImage}
              />
            )}
            <label htmlFor="file" className={styles.uploadButton}>
              <AddAPhotoIcon />
            </label>
            <input
              type="file"
              id="file"
              onChange={handleFileChangeAndUpload}
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

            <div className={styles["input-group"]}>
              <label className={styles.readLabel2}>Mobile Number *</label>
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
                style={{
                  backgroundColor: "#797979",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "40px",
                  padding: "8px",
                  marginTop: "-61.5%",
                  marginLeft: "91.6%",
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
          <div className={styles.accountS}>
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

            <div className={styles["input-group"]}>
              <label className={styles.readLabel2}> Old Password </label>
              <input
                required
                type={
                  editAccountMode
                    ? showOldPassword
                      ? "text"
                      : "password"
                    : "password"
                }
                name="oldPassword"
                autoComplete="off"
                className={styles.input}
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
              <label className={styles.readLabel}>New Password</label>
              <input
                required
                type={
                  editAccountMode
                    ? showNewPassword
                      ? "text"
                      : "password"
                    : "password"
                }
                name="newPassword"
                autoComplete="off"
                className={styles.changeInput}
                readOnly={!editAccountMode}
                value={accountValues.newPassword}
                onChange={handleAccountInputChange}
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
                className={`${styles.changeInput} ${
                  confirmPasswordError ? styles.errorInput : ""
                }`}
                style={{
                  border: confirmPasswordError
                    ? "1px solid red"
                    : "1px solid #9e9e9e",
                }}
                readOnly={!editAccountMode}
                value={accountValues.confirmPassword}
                onChange={handleAccountInputChange}
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
              open={passwordMismatchSnackbar}
              autoHideDuration={5000}
              onClose={handleAccountSnackbarClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleAccountSnackbarClose}
                severity="error"
                sx={{ width: "290px" }}
              >
                Passwords do not match.
              </MuiAlert>
            </Snackbar>

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
                  backgroundColor: "#797979",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "40px",
                  padding: "8px",
                  marginTop: "-51%",
                  marginLeft: "-3%",
                  cursor: "pointer",
                  transition:
                    "background-color 0.4s ease-in-out, color 0.4s ease-in-out, border-color 0.4s ease-in-out",
                }}
              >
                <IconButton onClick={handleAccountEditClick}>
                  <ManageAccountsSharpIcon />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </div>
      </div>

      {/* for notification and profile */}
    </div>
  );
};

export default ProfilePage;
