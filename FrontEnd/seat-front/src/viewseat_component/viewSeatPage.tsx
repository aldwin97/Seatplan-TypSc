import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./viewSeatPage.module.css";
import { faSearch} from "@fortawesome/free-solid-svg-icons";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Seat {
  position: { x: number; y: number };
  color: string;
  position_name: string;
  occupant: string;
  project: string;
  comments: string[];
  viewerNames: string[];
  seatstatus: string;
  position_x: number;
  position_y: number;
  seat_num: number;
  full_name: string;
  project_name: string;
  seat_status: string;
  color_code: string;
  seat_id: number;
  user_id: number;
  userId1: number;
  userId2: number;
}

interface SeatPopupProps {
  seat: Seat;
  onClose: () => void;
  setSeats: (seats: Seat[]) => void;
  seats: Seat[];
}
interface Occupant {
  user_id: number;
  name: string;
  first_name: string;
  last_name: string;
}

function ViewSeatPage() {
  const navigate = useNavigate();

  const viewSeatPageHandleClick = () => {
    navigate("/");
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false); // Add const for isDragging

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      if (isDragging.current) {
      }
    }
  };
  const handleMouseLeave = () => {
    isDragging.current = false;
  };

  const [seats, setSeats] = useState<Seat[]>([]);
  useEffect(() => {
    fetch("http://localhost:8080/seat/showAllSeat")
      .then((response) => response.json())
      .then((data) => {
        // Update the position and other properties of each seat based on the data received from the backend
        const updatedSeats = data.map((seat: Seat) => {
          return {
            ...seat,
            seat_id: seat.seat_id,
            position: { x: seat.position_x, y: seat.position_y },
            occupant: seat.full_name,
            project: seat.project_name,
            seatstatus: seat.seat_status,
            color: seat.color_code,
          };
        });
        setSeats(updatedSeats);
      })
      .catch((error) => console.error("Error fetching seat data:", error));
  }, []);

  const [zoomLevel] = useState(1);
  const [canvasOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const lastClickTimeRef = useRef<number>(0);
  const [doubleClickFlag, setDoubleClickFlag] = useState(false);
  const [draggingSeatIndex, setDraggingSeatIndex] = useState(-1);

  // MODAL

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(false);
  const [redirectToDashboard, setRedirectToDashboard] = useState(false);

  useEffect(() => {
    if (redirectToDashboard) {
      navigate("/dashboardPage");
    }
  }, [redirectToDashboard, navigate]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError(false);
  };

  const [username, setUsername] = useState("");
  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const dashboardPageHandleClick = async () => {
    if (!username || !password) {
      setError(true);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setError(true);
        return;
      }

      const responseData = await response.json();
      const { user_id } = responseData; // Extract the user_id from responseData
      console.log(user_id);

      setRedirectToDashboard(true);

      // Save session data to Session Storage
      window.sessionStorage.setItem("user_id", user_id);
      window.sessionStorage.setItem("user_name", username);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  // MODAL END

  const handleMouseUp = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = (event.clientX - rect.left) / zoomLevel - canvasOffset.x;
    const offsetY = (event.clientY - rect.top) / zoomLevel - canvasOffset.y;

    const clickedSeatIndex = seats.findIndex((seat) => {
      const { x, y } = seat.position;
      const seatWidth = 50 / zoomLevel;
      const seatHeight = 50 / zoomLevel;
      const seatRight = x + seatWidth;
      const seatBottom = y + seatHeight;

      return (
        offsetX >= x &&
        offsetX <= seatRight &&
        offsetY >= y &&
        offsetY <= seatBottom
      );
    });

    if (draggingSeatIndex > -1 && clickedSeatIndex > -1) {
      const draggingSeat = seats[draggingSeatIndex];
      const clickedSeat = seats[clickedSeatIndex];
      const updatedSeats = seats.map((seat, index) => {
        if (index === draggingSeatIndex) {
          return { ...clickedSeat, isSwapping: false };
        }
        if (index === clickedSeatIndex) {
          return { ...draggingSeat, isSwapping: false };
        }
        return seat;
      });
      setSeats(updatedSeats);
    }

    if (!doubleClickFlag) {
      setSelectedSeat(null);
    }

    setDoubleClickFlag(false); // Reset the double-click flag
    setDraggingSeatIndex(-1); // Reset the dragging seat index
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const target = event.target as typeof event.target & {
      search: { value: string };
    };
    setSearchQuery(target.search.value);
  };

  const filteredSeats = seats.filter((seat) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    return (
      seat.occupant?.toLowerCase().includes(lowerCaseSearchQuery) ||
      seat.seat_id.toString().includes(lowerCaseSearchQuery)
    );
  });

const customBorders = [
    { x: 199, y1: 99, y2: 399, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 }, 

    { x: 225, y1: 99, y2: 399, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 }, 
 
    { x: 199, y1: 899, y2: 799, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 }, 

    { x: 199, y1: 1299, y2: 999, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 }, 

    { x: 560, y1: 99, y2: 399, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 585, y1: 99, y2: 799, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 920, y1: 99, y2: 899, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 945, y1: 99, y2: 999, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 1280, y1: 99, y2: 899, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 1305, y1: 99, y2: 899, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 1640, y1: 99, y2: 699, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 1665, y1: 99, y2: 699, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 2000, y1: 99, y2: 599, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 2025, y1: 99, y2: 599, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 2360, y1: 99, y2: 499, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 2385, y1: 99, y2: 499, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },

    { x: 2720, y1: 99, y2: 299, lineWidth: 10 }, 
    { x: 0, y1: 0, y2: 0, lineWidth: 2 },
  ];
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
 
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      ctx.scale(zoomLevel, zoomLevel);
  
      filteredSeats.forEach((seat) => {
        const { x, y } = seat.position;
        const { color } = seat;
  
        const scaledX = x / zoomLevel;
        const scaledY = y / zoomLevel;
        const seatSize = 98 / zoomLevel;
        const textOffsetX = 2 / zoomLevel;
        const numberBoxSize = 80 / zoomLevel;
  
        canvas.style.cursor = 'pointer';

      // Draw custom border lines
      customBorders.forEach((border) => {
        ctx.beginPath();
        ctx.moveTo(border.x, border.y1);
        ctx.lineTo(border.x, border.y2);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = border.lineWidth;
        ctx.stroke();
      });
        // Draw the background shadow at the very back of the seat
      ctx.save();
      
      ctx.fillStyle = '#ffffff';
      // Draw the seat box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
      ctx.strokeStyle = '#000000';
      ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);
      ctx.lineWidth = 1;
      ctx.restore();
      ctx.fillStyle = '#ffffff';
      // Draw the seat number box
      ctx.fillRect(scaledX, scaledY, numberBoxSize, numberBoxSize);
      ctx.fillStyle = '#000000';
      ctx.font = `${11 / zoomLevel}px Arial`;
      ctx.fillText(seat.seat_id.toString(), scaledX + numberBoxSize / 12, scaledY + numberBoxSize / 7 + 1);

      ctx.fillStyle = '#ffffff';
        const borderWidth = 2; // Adjust the border width as needed
        ctx.fillStyle = '#ffffff';
          // Draw the seat
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);
          ctx.fillStyle = '#ffffff';
          // Draw the border rectangle
          ctx.strokeStyle = '#000000';
          ctx.fillStyle = '#ffffff';
          // Calculate the position for the border rectangle
          const borderX = scaledX + numberBoxSize / 14 - borderWidth / 2 - 5;
          const borderY = scaledY + numberBoxSize / 8 - borderWidth / 2 - 9;
          const borderRectWidth = ctx.measureText(seat.seat_id.toString()).width + 13 + borderWidth; // Adjust the border width based on the text width
          const borderRectHeight = 21 + borderWidth; // Adjust the border height as needed
          ctx.fillStyle = '#ffffff';
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(borderX, borderY, borderRectWidth, borderRectHeight);
    
        const seatBoxY = scaledY + numberBoxSize;
        const seatBoxHeight = seatSize - numberBoxSize;
        ctx.fillStyle =color;
        ctx.fillRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.strokeRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.fillStyle = '#000000';
    
        const textOffsetY = 45; // Adjust this value to create some vertical space between the occupant and project name


          if (seat.position_name !== 'Machine') {
            // Draw the occupant's name
            const occupantNameParts = seat.occupant.split(' ');
            const surname = occupantNameParts[1];
            const firstName = occupantNameParts[0];
            const occupantName = `${firstName} ${surname} `;
            
            const occupantNameWidth = ctx.measureText(occupantName).width;
            
            const centerOffsetX = (seatSize - occupantNameWidth) / 2;
            const adjustedTextOffsetX = textOffsetX + centerOffsetX;
            
            let fontSize = 11;
            while (ctx.measureText(occupantName).width > seatSize - adjustedTextOffsetX * 2) {
              fontSize--;
              ctx.font = `${fontSize}px Arial`;
            }
            
            ctx.fillText(occupantName, scaledX + adjustedTextOffsetX, scaledY + textOffsetY);
          }



        // Get the acronym of the project name
        const projectNameAcronym = seat.project_name
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase())
          .join("");

        ctx.fillText(
          projectNameAcronym,
          scaledX + seatSize / 2.7,
          scaledY + seatSize - textOffsetY / 1 + 40
        );

        if (seat.position_name) {
          const positionNameAcronym = seat.position_name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase())
            .join("");

          // Calculate the center position to horizontally align the position name acronym
          const positionNameAcronymWidth =
            ctx.measureText(positionNameAcronym).width;
          const centerOffsetX = (seatSize - positionNameAcronymWidth) / 6;
          const adjustedTextOffsetX = textOffsetX + centerOffsetX;

          // Calculate the font size for the position name acronym to fit inside the seat box
          let fontSize = 10;
          while (
            ctx.measureText(positionNameAcronym).width >
            seatSize - adjustedTextOffsetX * 2
          ) {
            fontSize--;
            ctx.font = `${fontSize}px Arial`;
          }

          // Draw the position name acronym below the seat
          ctx.fillText(
            positionNameAcronym,
            scaledX + +seatSize / 2.3,
            +scaledY + textOffsetY / 3.4 + 1
          );
        
                        // Draw an icon for the machine position
                if (seat.position_name === 'Machine') {
                  const machineIconSize = 60 / zoomLevel;
                  const machineIconX = scaledX + (seatSize - machineIconSize) / 1;
                  const machineIconY = scaledY + (seatSize - machineIconSize) / 1;

                  // Load the machine icon image
                  const machineIcon = new Image();
                  machineIcon.src = '/machine.png';

                  // Draw the machine icon image
                  machineIcon.onload = () => {
                    console.log('Machine icon loaded successfully');
                    ctx.drawImage(machineIcon, machineIconX - machineIconSize / 4, machineIconY - machineIconSize / 2.5, machineIconSize, machineIconSize);
                  };
                  machineIcon.onerror = () => {
                    console.log('Error loading machine icon');
                    console.error('Error details:', machineIcon.src); // Log the image source to help diagnose the issue
                  };
                }


        if (selectedSeat && seat.seat_id === selectedSeat.seat_id) {
          ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
          ctx.fillText('Edit', scaledX + seatSize / 2 - 10, scaledY + seatSize / 2 + 5);
        }
    }});
    }
  }, [filteredSeats, zoomLevel, selectedSeat]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      dashboardPageHandleClick();
    }
  };

  return (
    <body className={styles.body}>
      {" "}
      <div className={styles.container}>
        <div className={styles.title}>SEAT PLAN VIEW</div>
        <div className={styles.canvasWrapper} ref={containerRef}>
          <div className={styles.root} ref={containerRef}>
            <div className={styles.scrollableCanvas}>
              <canvas
                ref={canvasRef}
                width={2800}
                height={1400}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
              ></canvas>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className={styles.searchForm}>
            <input
              type="text"
              name="search"
              placeholder="Search seat"
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </form>

          {/* <button
            className={styles.sign}
            type="submit"
            onClick={viewSeatPageHandleClick}
          >
            SIGN IN
          </button> */}

          <div className={styles.signInContainer}>
            <button onClick={openModal} className={styles.sign} type="submit">
              SIGN IN
            </button>
          </div>

          {isModalOpen && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalContent}>
                <div className={styles.shape}></div>
                <button className={styles.closeButton} onClick={closeModal}>
                  Cancel
                </button>
                <h2>SIGN IN</h2>

                <div
                  className={`${styles["input-group"]} ${
                    error && !username && styles.errorInput
                  }`}
                >
                  <input
                    required
                    type="text"
                    name="text"
                    autoComplete="off"
                    className={styles.input}
                    value={username}
                    onChange={handleUsernameChange}
                    onKeyDown={handleKeyDown}
                  />
                  <label className={styles["user-label"]}>Username</label>
                </div>

                <div
                  className={`${styles["input-group"]} ${
                    error && !password && styles.errorInput
                  }`}
                >
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="off"
                    className={styles.input}
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={handleKeyDown}
                  />
                  <label className={styles["user-label"]}>Password</label>
                  <span
                    className={`${styles["toggle-password"]} ${
                      showPassword ? styles.active : ""
                    }`}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                  </span>
                </div>

                <div
                  className={`${styles.errorMessage} ${
                    error ? styles.showError : ""
                  }`}
                  style={{ visibility: error ? "visible" : "hidden" }} // Use visibility
                >
                  Incorrect username or password!
                </div>

                <button
                  onClick={dashboardPageHandleClick}
                  className={styles.sub2}
                  type="submit"
                >
                  SIGN IN
                </button>
              </div>
            </div>
          )}

          {/* Render seats on the canvas */}
          {seats.map((seat) => (
            <div
              key={seat.seat_id}
              className={styles.seat}
              style={{ left: seat.position_x, top: seat.position_y }}
            >
              {seat.seat_num}
            </div>
          ))}
        </div>

        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <div className={`${styles.colorBox} ${styles.available}`}></div>
            <span className={styles.label}>Available Seats</span>
          </div>
          <div className={styles.legendItem}>
            <div className={`${styles.colorBox} ${styles.unavailable}`}></div>
            <span className={styles.label}>Unavailable/Maintained Seats</span>
          </div>
        </div>
      </div>
    </body>
  );
}

export default ViewSeatPage;
