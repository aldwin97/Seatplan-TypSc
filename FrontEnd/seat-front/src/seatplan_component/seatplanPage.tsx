import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFaceSmile, faChartBar, faUsers, faProjectDiagram, faPowerOff, faSmile, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './seatplanPage.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';


interface Seat {
  position: { x: number; y: number };
  isSwapping: boolean;
  color: string;
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
interface SeatModel {
  position: { x: number; y: number };
  isSwapping: boolean;
  color: string;
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

function SeatPopup({ seat, onClose, setSeats, seats }: SeatPopupProps): JSX.Element {
  const [selectedSeatId, setSelectedSeatId] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedViewerIndex, setSelectedViewerIndex] = useState(-1);
  const [reply, setReply] = useState('');
  const [occupantsList, setOccupantsList] = useState<Occupant[]>([]);
  const [isOccupantAlreadyAssigned, setIsOccupantAlreadyAssigned] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Add selectedOccupant state with a default value
  const [selectedOccupant, setSelectedOccupant] = useState<string>('');

  useEffect(() => {
    document.body.classList.toggle('popupOpen', true);
    return () => {
      document.body.classList.toggle('popupOpen', false);
    };
  }, []);
  
  const handleSeatSelect = (selectedSeatId: string) => {
    setSelectedSeatId(selectedSeatId);
  };
  function getUpdatedByFromSessionStorage(): number {
    const user_id = sessionStorage.getItem('user_id');
    if (user_id) {
      console.log('Value of updated_by retrieved from session storage:', user_id);
      return parseInt(user_id, 10);
    } else {
      console.warn('Value of updated_by not found in session storage. Defaulting to 0.');
      return 0;
    }
  }
  
  
  const handleSwapSeats = async () => {
    if (selectedSeatId && selectedSeatId !== seat.seat_id.toString()) {
      const currentSeat = seats.find((s) => s.seat_id === seat.seat_id);
      const swapSeat = seats.find((s) => s.seat_id === Number(selectedSeatId));
      const updated_by = getUpdatedByFromSessionStorage();
  
      if (currentSeat && swapSeat) {
        // Create the updated seats with the swapped occupant and project
        const updatedCurrentSeat = {
          ...currentSeat,
          occupant: swapSeat.occupant,
          project: swapSeat.project,
          userId1: swapSeat.userId1,
          userId2: swapSeat.userId2,
        };
        const updatedSwapSeat = {
          ...swapSeat,
          occupant: currentSeat.occupant,
          project: currentSeat.project,
          userId1: currentSeat.userId1,
          userId2: currentSeat.userId2,
        };
  
        // Swap the seats in the frontend
        const updatedSeats = seats.map((s) => {
          if (s.seat_id === updatedCurrentSeat.seat_id) {
            return updatedCurrentSeat;
          } else if (s.seat_id === updatedSwapSeat.seat_id) {
            return updatedSwapSeat;
          }
          return s;
        });
  
        try {
          // Swap the seats in the backend
          await fetch(
            `http://localhost:8080/seat/swap/${seat.seat_id}/${selectedSeatId}/${updated_by}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                seatId1: updatedCurrentSeat.seat_id,
                seatId2: updatedSwapSeat.seat_id,
                userId1: updatedCurrentSeat.userId1,
                userId2: updatedCurrentSeat.userId2,
                updated_by: updated_by,
              }),
            }
          );
  
          // Update the frontend with the swapped seats
          setSeats(updatedSeats);
  
          console.log('Seats swapped successfully');
          console.log('Data being swapped:');
          console.log('Current Seat:', updatedCurrentSeat);
          console.log('Swap Seat:', updatedSwapSeat);
  
          onClose();
        } catch (error) {
          console.error('Failed to swap seats:', error);
        }
      }
    }
  };
  
  
  
  
  
  
  

 useEffect(() => {
  // Check if the selected occupant is already assigned to another seat
  const checkOccupantAssignment = () => {
    const seatsWithSameOccupant = seats.filter(
      (s) => s.occupant === selectedOccupant && s.seat_id !== seat.seat_id
    );
    setIsOccupantAlreadyAssigned(seatsWithSameOccupant.length > 0);
  };

  checkOccupantAssignment();
}, [selectedOccupant, seat.seat_id, seats]);

const isSeatOccupied = seat.occupant !== '' && seat.project !== '';
const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  if (isOccupantAlreadyAssigned) {
    setErrorMsg('This occupant is already assigned to another seat.');
    return;
  }

  try {
    const updatedSeats = seats.map((s) => {
      if (s.seat_id === seat.seat_id) {
        return { ...s, occupant: selectedOccupant }; // Update 'occupant' with 'selectedOccupant'
      }
      return s;
    });

    setSeats(updatedSeats);

    // Prepare the seat data to be sent to the backend
    const updatedSeatData = {
      ...seat,
      user_id: selectedOccupant, // Assign the selected occupant's ID
    };

    // Send the updated seat data to the backend
    const response = await fetch(`http://localhost:8080/seat/update/${seat.seat_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedSeatData),
    });

    if (response.ok) {
      console.log('Seat updated successfully');
      onClose();
      window.location.reload(); // Refresh the page
    } else if (response.status === 500) {
      setErrorMsg('This occupant is already assigned to another seat.');
      // You can also display the error message on the page instead of using an alert
      // For example, set a state to show the error message:
      // setErrorMsg('This occupant is already assigned to another seat.');
    } else {
      console.error('Failed to update seat');
    }
  } catch (error) {
    console.error('Error occurred while updating seat:', error);
  }
};

  useEffect(() => {
    fetchOccupants();
  }, []);
  

  const handleViewComments = () => {
    setShowComments(!showComments);
    setSelectedViewerIndex(-1);
    setReply('');
  };

  const handleViewerClick = (viewerIndex: number) => {
    setSelectedViewerIndex(viewerIndex);
  };

  const handleReplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReply(event.target.value);
  };

  const handleReplySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedSeats = seats.map((s) => {
      if (s.seat_id === seat.seat_id) {
        const updatedComments = [...s.comments];
        updatedComments[selectedViewerIndex] += ` (Admin): ${reply}`;
        return { ...s, comments: updatedComments };
      }
      return s;
    });
    setSeats(updatedSeats);
    setReply('');
  };

  const [isEditMode, setIsEditMode] = useState(false);

  const handleEdit = () => {
    setIsEditMode(true);
  };
  const handleOccupantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOccupant(event.target.value);
  };
  
  // Function to fetch occupants and projects from the backend
 
  useEffect(() => {
    fetchOccupants();
  }, []);

  /// Function to fetch the list of occupants from the backend
const fetchOccupants = async () => {
  try {
    const response = await fetch('http://localhost:8080/seat/showAllUser');
    if (response.ok) {
      const occupantsData: Occupant[] = await response.json();
      setOccupantsList(occupantsData);
    } else {
      console.error('Failed to fetch occupants');
    }
  } catch (error) {
    console.error('Error occurred while fetching occupants:', error);
  }
};


  return (
    <div className={`${styles.seatPopupContainer} ${styles.popupOpen}`}>
      <div className={styles.seatPopupContent}>
        <h3>{seat.seat_id}</h3>
        <form onSubmit={handleFormSubmit}>
        {isEditMode ? (
          <>
            <select
              value={selectedOccupant}
              onChange={handleOccupantChange}
              required
            >
              <option value="">Select an occupant</option>
              {occupantsList.map((occupant) => (
                <option key={occupant.user_id} value={occupant.user_id}>
                  {`${occupant.first_name} ${occupant.last_name}`}
                </option>
              ))}
            </select>
            {errorMsg && (
  <div className={styles.errorPopup}>
    <p>{errorMsg}</p>
    <button
      onClick={() => {
        setErrorMsg('');
        window.location.reload();
      }}
    >
      Close
    </button>
  </div>
)}

              {isSeatOccupied ? (
                <>
                  <button type="submit">Save</button>
                  <div>
                <p>Select a seat to swap:</p>
                <select
                  className={styles.value}
                  value={selectedSeatId}
                  onChange={(e) => handleSeatSelect(e.target.value)}
                >
                  <option className={styles.value} value="">
                    Select a seat
                  </option>
                  {seats.map((seat) => (
                    <option key={seat.seat_id} value={seat.seat_id}>
                      {seat.seat_id}
                    </option>
                  ))}
                </select>
                <button type="button" className={styles.swapButton} onClick={handleSwapSeats}>
                  Swap Now
                </button>
              </div>
                </>
              ) : (
                <>
                  <button type="submit">Save</button>
                  {!isSeatOccupied && (
                    <button type="button" className={styles.editButton} onClick={handleEdit}>
                      Edit
                    </button>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <label>
                Occupant:
                <input type="text" value={seat.occupant} readOnly={!isSeatOccupied} />
              </label>
              <label>
                Project:
                <input type="text" value={seat.project} readOnly={!isSeatOccupied} />
              </label>
              {isSeatOccupied && (
                <button type="button" className={styles.editButton} onClick={handleEdit}>
                  Edit
                </button>
              )}
            </>
          )}
          <button type="button" className={styles.editButton} onClick={handleViewComments}>
            {showComments ? 'Hide Comments' : 'View Comments'}
          </button>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            Close
          </button>
          {showComments && (
            <>
              <h4>Comments:</h4>
              <ul>
                {seat.viewerNames.map((viewerName, index) => (
                  <li key={index} onClick={() => handleViewerClick(index)}>
                    <span className={styles.viewerName}>{viewerName}</span>
                  </li>
                ))}
              </ul>
              {selectedViewerIndex >= 0 && (
                <>
                  <h4>Comment:</h4>
                  <p>{seat.comments[selectedViewerIndex]}</p>
                  <form onSubmit={handleReplySubmit}>
                    <label>
                      Reply:
                      <input
                        type="text"
                        value={reply}
                        onChange={handleReplyChange}
                        placeholder="Type your reply..."
                      />
                    </label>
                    <button type="submit">Send Reply</button>
                  </form>
                </>
              )}
            </>
          )}
        </form>
      </div>
    </div>
  );
}

function SeatplanPage() {
  const navigate = useNavigate();

  const dashboardPageHandleClick = () => {
    navigate('/DashboardPage');
  };

  const adminPageHandleClick = () => {
    navigate('/AdminPage');
  };

  const logInPageHandleClick = () => {
    navigate('/');
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [seats, setSeats] = useState<Seat[]>([]);
  useEffect(() => {
    fetch('http://localhost:8080/seat/showAllSeat')
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
      .catch((error) => console.error('Error fetching seat data:', error));
  }, []);

  
  
  const [zoomLevel] = useState(1);
  const [canvasOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

// Update the canvas rendering code to use the fetched seat data
useEffect(() => {
  const canvas = canvasRef.current;
  const ctx = canvas?.getContext('2d');

  if (canvas && ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.scale(zoomLevel, zoomLevel);
    seats.forEach((seat) => {
      const { x, y } = seat.position ?? { x: 0, y: 0 };
      const { color } = seat;

      const scaledX = x / zoomLevel;
      const scaledY = y / zoomLevel;
      const seatSize = 100 / zoomLevel;
      const textOffsetX = 2 / zoomLevel;
      const textOffsetY = 50 / zoomLevel;
      const numberBoxSize = 20 / zoomLevel;

      canvas.style.cursor = 'pointer';
      ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9'; // Set default color to light gray
      ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
      ctx.strokeStyle = '#000000'; // Set the border color to black
      ctx.lineWidth = 2 / zoomLevel; // Adjust the border width as needed
      ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);

      // Draw numbering box
      ctx.fillStyle = '#28a745'; // Set the color of the numbering box
      ctx.fillRect(scaledX, scaledY, numberBoxSize, numberBoxSize);
      ctx.fillStyle = '#000000'; // Set the color of the numbering text
      ctx.font = `${11 / zoomLevel}px Arial`; // Set the font size

      // Display the seat_id as a number
      ctx.fillText(String(seat.seat_id), scaledX + numberBoxSize / 2, scaledY + numberBoxSize / 2 + 1);


      // Draw seat box
      const seatBoxY = scaledY + numberBoxSize; // Adjust the position of the seat box
      const seatBoxHeight = seatSize - numberBoxSize; // Adjust the height of the seat box
      ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
      ctx.fillRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2 / zoomLevel;
      ctx.strokeRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
      ctx.fillStyle = '#000000';

      if (seat.isSwapping) {
        // Get the swapped seat
        const swappedSeat = seats.find((s) => String(s.seat_id) === String(seat.occupant));

        if (swappedSeat) {
          const maxTextWidth = seatSize - textOffsetX * 2;
          const text = swappedSeat.occupant;
          let fontSize = 11 / zoomLevel;

          // Adjust the font size to fit the text within the seat box
          while (ctx.measureText(text).width > maxTextWidth) {
            fontSize -= 1 / zoomLevel;
            ctx.font = `${fontSize}px Arial`;
          }

          ctx.fillText(swappedSeat.occupant, scaledX + textOffsetX, scaledY + textOffsetY);
        }
      } else {
        const maxTextWidth = seatSize - textOffsetX * 2;
        const text = seat.occupant;
        let fontSize = 11 / zoomLevel;

        // Adjust the font size to fit the text within the seat box
        while (ctx.measureText(text).width > maxTextWidth) {
          fontSize -= 1 / zoomLevel;
          ctx.font = `${fontSize}px Arial`;
        }

        ctx.fillText(seat.occupant, scaledX + textOffsetX, scaledY + textOffsetY);
      }

      if (selectedSeat && seat.seat_id === selectedSeat.seat_id) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Set the button background color
        ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
        ctx.fillStyle = '#FFFFFF'; // Set the button text color
        ctx.fillText('Edit', scaledX + seatSize / 2 - 10, scaledY + seatSize / 2 + 5);
      }
    });
  }
}, [seats, zoomLevel, selectedSeat]);
  
  

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

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
  
      return offsetX >= x && offsetX <= seatRight && offsetY >= y && offsetY <= seatBottom;
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
  const projectPageHandleClick = () => {
    navigate('/ProjectPage');
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
  
      return offsetX >= x && offsetX <= seatRight && offsetY >= y && offsetY <= seatBottom;
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
  
  const [searchQuery, setSearchQuery] = useState('');

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
      (seat.seat_id.toString().includes(lowerCaseSearchQuery))
    );
  });
  
  
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
  
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      ctx.scale(zoomLevel, zoomLevel);
  
      filteredSeats.forEach((seat) => {
        const { x, y} = seat.position;
        const { color } = seat;
  
        const scaledX = x / zoomLevel;
        const scaledY = y / zoomLevel;
        const seatSize = 100 / zoomLevel;
        const textOffsetX = 2 / zoomLevel;
        const textOffsetY = 50 / zoomLevel;
        const numberBoxSize = 20 / zoomLevel;
  
        canvas.style.cursor = 'pointer';
        ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
        ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 / zoomLevel;
        ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);
  
        ctx.fillStyle = '#28a745';
        ctx.fillRect(scaledX, scaledY, numberBoxSize, numberBoxSize);
        ctx.fillStyle = '#000000';
        ctx.font = `${11 / zoomLevel}px Arial`;
        ctx.fillText(seat.seat_id.toString(), scaledX + numberBoxSize / 2, scaledY + numberBoxSize / 2 + 1);

        const seatBoxY = scaledY + numberBoxSize;
        const seatBoxHeight = seatSize - numberBoxSize;
        ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
        ctx.fillRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 / zoomLevel;
        ctx.strokeRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.fillStyle = '#000000';
  
        if (seat.isSwapping) {
          const swappedSeat = filteredSeats.find((s) => String(s.seat_id) === String(seat.occupant));
          if (swappedSeat) {
            const maxTextWidth = seatSize - textOffsetX * 2;
            const text = swappedSeat.occupant;
            let fontSize = 11 / zoomLevel;
  
            while (ctx.measureText(text).width > maxTextWidth) {
              fontSize -= 1 / zoomLevel;
              ctx.font = `${fontSize}px Arial`;
            }
  
            ctx.fillText(swappedSeat.occupant, scaledX + textOffsetX, scaledY + textOffsetY);
          }
        } else {
          const maxTextWidth = seatSize - textOffsetX * 2;
          const text = seat.occupant;
          let fontSize = 11 / zoomLevel;
  
          while (ctx.measureText(text).width > maxTextWidth) {
            fontSize -= 1 / zoomLevel;
            ctx.font = `${fontSize}px Arial`;
          }
  
          ctx.fillText(seat.occupant, scaledX + textOffsetX, scaledY + textOffsetY);
        }
  
        if (selectedSeat && seat.seat_id === selectedSeat.seat_id) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('Edit', scaledX + seatSize / 2 - 10, scaledY + seatSize / 2 + 5);
        }
      });
    }
  }, [filteredSeats, zoomLevel, selectedSeat]);
  
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };
  return (
   <body className={styles.body}> <div className={styles.container}>
      <button className={`${styles.burgerButton} ${isDropdownOpen ? styles.open : ''}`} onClick={toggleDropdown}>
        <div className={styles.burgerIcon}></div>
        <div className={styles.burgerIcon}></div>
        <div className={styles.burgerIcon}></div>
      </button>
     
      {isDropdownOpen && (
        <div className={`${styles.dropdownMenu} ${styles.dropdownRows}`}>
          <button onClick={dashboardPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon icon={faChartBar} className={styles.icon} />
            Dashboard
          </button>
          <button onClick={adminPageHandleClick} className={styles.sub}>
            <FontAwesomeIcon icon={faUsers} className={styles.icon} />
            Members
          </button>
          <button className={styles.sub}>
          <FontAwesomeIcon icon={faEdit} className={styles.icon} />
            Seat Plan Management
          </button>
          <button onClick={projectPageHandleClick} className="sub">
            <FontAwesomeIcon icon={faProjectDiagram} className="icon" />
           Projects
          </button>
        </div>
      )}

      <button className={`${styles.profile} ${isProfileDropdownOpen ? styles.open2 : ''}`} onClick={toggleProfileDropdown}>
        <FontAwesomeIcon icon={faUser} />
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
      {selectedSeat && (
        <SeatPopup seat={selectedSeat} onClose={() => setSelectedSeat(null)} setSeats={setSeats} seats={seats} />
      )}
<div className={styles.title}>SEAT PLAN MANAGEMENT</div>
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

export default SeatplanPage;
