import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styles from "./profilePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import {
  faUser,
  faBell,
  faPowerOff,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import profileBackg from "./assets/profileBackg.jpg";
import ManageAccountsSharpIcon from "@mui/icons-material/ManageAccountsSharp";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto"; // Added import
import axios from "axios";

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isProfileDropdownOpen, setProfileDropdownOpen] =
    useState<boolean>(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

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

        const responseData: UserProfile = response.data[0];
        setProfileData(responseData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfileData();
  }, []);

  if (!profileData) {
    return;
  }

  const viewSeatPageHandleClick = () => {
    navigate("/viewSeatPage");
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
          window.location.reload();
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
    // Restore the initial account values when the "Cancel" button is clicked
    setAccountValues({ ...initialAccountValues });
    setConfirmPasswordError(""); // Reset the confirmPasswordError state
    setPasswordMismatchSnackbar(false); // Hide the Snackbar for password mismatch when cancelled
    setAccountEditMode(false);
  };

  const handleAccountEditClick = () => {
    // Save the current account values when entering edit mode
    setInitialAccountValues({ ...accountValues });
    setAccountEditMode(true);
  };

  // INPUTS

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleAccountInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAccountValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Reset the value of the file input
    if (file) {
      // Check if the file is an image based on the MIME type or file extension
      if (
        !file.type.startsWith("image/") ||
        !/\.(jpg|jpeg|png)$/i.test(file.name)
      ) {
        setErrorMsg("File not supported.");

        return;
      }

      // Handle the file here if needed
      console.log("Selected file:", file);

      // Check if the file is a Blob
      if (file instanceof Blob) {
        // console.log('File is a Blob!');

        // Generate a Blob URL for the selected file
        const blobUrl = URL.createObjectURL(file);
        // console.log('Blob URL:', blobUrl);

        // Use the blobUrl directly to display the image (e.g., set it as an image src)
        setSelectedImage(blobUrl);
      }

      // Read the selected file as a data URL (base64-encoded string)
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result as string;

        // Set the base64File as the image URL to be displayed
        setSelectedImage(base64File);
        console.log(base64File);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleProfileDropdown = (): void => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
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
      // Show success Snackbar when the form is valid
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
    setPersonalFormValid(true); // Reset the form validity state when Snackbar is closed
    setPersonalFormValidSnackbar(false); // Hide the success Snackbar when it's closed
  };

  const handleAccountSnackbarClose = () => {
    setPasswordMismatchSnackbar(false);
  };

  return (
    <div className={styles.backg}>
      <div className={styles.form1}>
        {/* Left Container */}
        <form className={styles.profileSum}>
          <div className={styles.cover}>
            <img src={profileBackg} alt="Profile Background" />
          </div>

          <div className={styles.inputDisplay}>
            <h3>
              {profileData.last_name} {profileData.first_name}
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

            {selectedImage ? (
              // Render the selected image if available with circular styling
              <img src={selectedImage} alt="Profile" />
            ) : (
              // Render a default image or placeholder if no file is selected with circular styling
              <img
                src={selectedImage ?? "default"}
                alt="Profile"
                className={!selectedImage ? styles.defaultImage : ""}
              />
            )}
            <label htmlFor="file" className={styles.uploadButton}>
              <AddAPhotoIcon />
            </label>
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              onChange={handleFileChange}
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

      <button
        className={`${styles.profile} ${
          isProfileDropdownOpen ? styles.open2 : ""
        }`}
        onClick={toggleProfileDropdown}
      >
        <FontAwesomeIcon icon={faUser as IconProp} />
      </button>

      {isProfileDropdownOpen && (
        <div className={styles.dropdownMenu2}>
          <button className={styles.sub}>
            <FontAwesomeIcon
              icon={faFaceSmile as IconProp}
              className={styles.icon}
            />
            Profile
          </button>

          <button onClick={logInPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon
              icon={faPowerOff as IconProp}
              className={styles.icon}
            />
            Logout
          </button>
        </div>
      )}

      <button className={styles.notif}>
        <FontAwesomeIcon icon={faBell as IconProp} />
      </button>
    </div>
  );
};

export default ProfilePage;
