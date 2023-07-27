import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./viewSeatPage.module.css";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface Seat {
  position: { x: number; y: number };
  isSwapping: boolean;
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

  // Add other properties if available in the response
}

function SeatPopup({ seat, onClose }: SeatPopupProps): JSX.Element {
  const [, setOccupantsList] = useState<Occupant[]>([]);

  useEffect(() => {
    document.body.classList.toggle("popupOpen", true);
    return () => {
      document.body.classList.toggle("popupOpen", false);
    };
  }, []);

  useEffect(() => {
    fetchOccupants();
  }, []);

  useEffect(() => {
    fetchOccupants();
  }, []);

  /// Function to fetch the list of occupants from the backend
  const fetchOccupants = async () => {
    try {
      const response = await fetch("http://localhost:8080/seat/showAllUser");
      if (response.ok) {
        const occupantsData: Occupant[] = await response.json();
        setOccupantsList(occupantsData);
      } else {
        console.error("Failed to fetch occupants");
      }
    } catch (error) {
      console.error("Error occurred while fetching occupants:", error);
    }
  };

  return (
    <div className={styles.seatPopupContainer}>
      <div className={styles.seatPopupContent}>
        <h3 className={styles.header}>Seat {seat.seat_id}</h3>
        <label className={styles.label}>
          Occupant:
          <input type="text" value={seat.occupant} readOnly />
        </label>
        <label className={styles.label}>
          Position:
          <input type="text" value={seat.position_name} readOnly />
        </label>
        <label className={styles.label}>
          Project:
          <input type="text" value={seat.project} readOnly />
        </label>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

function ViewSeatPage() {
  const navigate = useNavigate();

  const viewSeatPageHandleClick = () => {
    navigate("/");
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
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

    if (clickedSeatIndex > -1) {
      const now = new Date().getTime();
      const doubleClickThreshold = 300;

      if (now - lastClickTimeRef.current <= doubleClickThreshold) {
        const clickedSeat = seats[clickedSeatIndex];
        setSelectedSeat(clickedSeat);
        setDoubleClickFlag(true); // Set the double-click flag
      } else {
        lastClickTimeRef.current = now;

        const isAnySeatSwapping = seats.some((seat) => seat.isSwapping);

        if (!isAnySeatSwapping) {
          setDraggingSeatIndex(clickedSeatIndex);
          const updatedSeats = seats.map((seat, index) => {
            if (index === clickedSeatIndex) {
              return { ...seat, isSwapping: true };
            }
            return seat;
          });
          setSeats(updatedSeats);
        }
      }
    }
  };
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
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);
    
        ctx.fillRect(scaledX, scaledY, numberBoxSize, numberBoxSize);
        ctx.fillStyle = '#000000';
        ctx.font = `${11 / zoomLevel}px Arial`;
        ctx.fillText(seat.seat_id.toString(), scaledX + numberBoxSize / 12, scaledY + numberBoxSize / 7 + 1);
        
        const borderWidth = 2; // Adjust the border width as needed

          // Draw the seat
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);

          // Draw the border rectangle
          ctx.strokeStyle = '#000000';

          // Calculate the position for the border rectangle
          const borderX = scaledX + numberBoxSize / 14 - borderWidth / 2 - 5;
          const borderY = scaledY + numberBoxSize / 8 - borderWidth / 2 - 9;
          const borderRectWidth = ctx.measureText(seat.seat_id.toString()).width + 13 + borderWidth; // Adjust the border width based on the text width
          const borderRectHeight = 21 + borderWidth; // Adjust the border height as needed

          ctx.lineWidth = borderWidth;
          ctx.strokeRect(borderX, borderY, borderRectWidth, borderRectHeight);
    
        const seatBoxY = scaledY + numberBoxSize;
        const seatBoxHeight = seatSize - numberBoxSize;
        ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
        ctx.fillRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.strokeRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.fillStyle = '#000000';
    
        const textOffsetY = 45; // Adjust this value to create some vertical space between the occupant and project name

    // Draw the occupant's name
    const occupantNameParts = seat.occupant.split(' '); // Assuming the occupant's name is in the format "FirstName LastName"
    const surname = occupantNameParts[1]; // Extract the surname and convert it to uppercase
    const firstName = occupantNameParts[0]; // Extract the first name
    const occupantName = `${surname}, ${firstName}`; // Format the name as "SURNAME FirstName"

    const occupantNameWidth = ctx.measureText(occupantName).width; // Get the width of the occupant name

    // Calculate the center position to horizontally align the occupant name
    const centerOffsetX = (seatSize - occupantNameWidth) / 2;
    const adjustedTextOffsetX = textOffsetX + centerOffsetX;

    // Calculate the font size for the occupant name to fit inside the seat box
    let fontSize = 11;
    while (ctx.measureText(occupantName).width > seatSize - adjustedTextOffsetX * 2) {
      fontSize--;
      ctx.font = `${fontSize}px Arial`;
    }

    ctx.fillText(occupantName, scaledX + adjustedTextOffsetX, scaledY + textOffsetY);

        // Get the acronym of the project name
        const projectNameAcronym = seat.project_name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .join('');
    
        ctx.fillText(projectNameAcronym, scaledX + seatSize /  2.7, scaledY + seatSize - textOffsetY/ 1 + 40);
        if (seat.position_name) {
          const positionNameAcronym = seat.position_name
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase())
            .join('');
        
          // Calculate the center position to horizontally align the position name acronym
          const positionNameAcronymWidth = ctx.measureText(positionNameAcronym).width;
          const centerOffsetX = (seatSize - positionNameAcronymWidth) / 6;
          const adjustedTextOffsetX = textOffsetX + centerOffsetX;
        
          // Calculate the font size for the position name acronym to fit inside the seat box
          let fontSize = 10;
          while (ctx.measureText(positionNameAcronym).width > seatSize - adjustedTextOffsetX * 2) {
            fontSize--;
            ctx.font = `${fontSize}px Arial`;
          }
        
          // Draw the position name acronym below the seat
          ctx.fillText(positionNameAcronym, scaledX + + seatSize / 2.3,+ scaledY + textOffsetY / 3.4 + 1);
        }
        
        
  
        if (selectedSeat && seat.seat_id === selectedSeat.seat_id) {
          ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
          ctx.fillText('Edit', scaledX + seatSize / 2 - 10, scaledY + seatSize / 2 + 5);
        }
      });
    }
  }, [filteredSeats, zoomLevel, selectedSeat]);

  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };
  return (
    <body className={styles.body}>
      {" "}
      <div className={styles.container}>
        {selectedSeat && (
          <SeatPopup
            seat={selectedSeat}
            onClose={() => setSelectedSeat(null)}
            setSeats={setSeats}
            seats={seats}
          />
        )}
        <div className={styles.title}>SEAT PLAN VIEW</div>
        <div className={styles.canvasWrapper} ref={containerRef}>
          <div className={styles.root} ref={containerRef}>
            <div className={styles.scrollableCanvas}>
              <canvas
                ref={canvasRef}
                width={2800}
                height={1400}
                onMouseDown={handleMouseDown}
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
          <button
            className={styles.sign}
            type="submit"
            onClick={viewSeatPageHandleClick}
          >
            SIGN IN
          </button>
          {/* Render seats on the canvas */}
          {seats.map((seat) => (
            <div
              key={seat.seat_id}
              className={styles.seat}
              style={{ left: seat.position_x, top: seat.position_y }}
              onClick={() => handleSeatClick(seat)}
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
