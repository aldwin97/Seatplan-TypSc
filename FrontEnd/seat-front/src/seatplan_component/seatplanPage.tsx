import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFaceSmile, faChartBar, faUsers, faProjectDiagram, faPowerOff, faEdit, faClose } from '@fortawesome/free-solid-svg-icons';
import styles from './seatplanPage.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';

interface Seat {
  position: { x: number; y: number };
  isSwapping: boolean;
  color: string;
  position_name:string;
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
  position_name: string;
  name: string;
  first_name: string;
  last_name: string;

  // Add other properties if available in the response
}


function SeatPopup({ seat, onClose, setSeats, seats }: SeatPopupProps): JSX.Element {
  const [selectedSeatId, setSelectedSeatId] = useState<number | null>(null);

  const [selectedViewerIndex, setSelectedViewerIndex] = useState(-1);
  const [reply, setReply] = useState('');
  const [occupantsList, setOccupantsList] = useState<Occupant[]>([]);
  const [ , setIsOccupantAlreadyAssigned] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');


  // Add selectedOccupant state with a default value
  const [selectedOccupant, setSelectedOccupant] = useState<string>('');

  useEffect(() => {
    document.body.classList.toggle('popupOpen', true);
    return () => {
      document.body.classList.toggle('popupOpen', false);
    };
  }, []);
  
  const handleSeatSelect = (selectedSeatId: number) => {
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
    if (selectedSeatId && selectedSeatId !== Number(seat.seat_id)) {
      const currentSeat = seats.find((s) => s.seat_id === seat.seat_id);
      const swapSeat = seats.find((s) => s.seat_id === Number(selectedSeatId));
      const updated_by = getUpdatedByFromSessionStorage();
  
      if (currentSeat && swapSeat) {
        // Create the updated seats with the swapped occupant and project
        const updatedCurrentSeat = {
          ...currentSeat,
          occupant: swapSeat.occupant,
          project: swapSeat.project,
        };
        const updatedSwapSeat = {
          ...swapSeat,
          occupant: currentSeat.occupant,
          project: currentSeat.project,
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
                seatId1: seat.seat_id,
                seatId2: selectedSeatId,
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
  
          // Refresh the page to fetch the updated seat data
          window.location.reload();
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

  // Check if the selected occupant is already assigned to another seat
  const isOccupantAssigned = seats.some((s) => s.occupant === selectedOccupant && s.seat_id !== seat.seat_id);

  if (isOccupantAssigned) {
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
    } else if (response.status === 400) {
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
const [showComments, setShowComments] = useState(false);

const toggleCommentsSection = () => {
  setShowComments((prevShowComments) => !prevShowComments);
  setSelectedViewerIndex(-1); // Reset the selected viewer index when toggling the section
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



useEffect(() => {
  setShowComments(false);
}, []);

return (
  <div className={`${styles.seatPopupContainer} ${styles.popupOpen}`}>
    <div className={styles.seatPopupContent}>
      <h3>Seat {seat.seat_id}</h3>
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
                  {`${occupant.last_name} ${occupant.first_name}`}
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
                    value={selectedSeatId || ''}
                    onChange={(e) => handleSeatSelect(Number(e.target.value))}
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
                  <button
                    type="button"
                    className={styles.swapButton}
                    onClick={handleSwapSeats}
                  >
                    Swap Now
                  </button>
                </div>
              </>
            ) : (
              <>
                <button type="submit">Save</button>
                {!isSeatOccupied && (
                  <button
                    type="button"
                    className={styles.editButton}
                    onClick={handleEdit}
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className={styles.labelsContainer}>
              <label className={styles.labels}>Occupant:</label>
              <input type="text" value={seat.occupant} readOnly={!isSeatOccupied} />
            </div>
            <div className={styles.labelsContainer}>
              <label className={styles.labels}>Position:</label>
              <input type="text" value={seat.position_name} readOnly={!isSeatOccupied} />
            </div>
            <div className={styles.labelsContainer}>
              <label className={styles.labels}>Project:</label>
              <input type="text" value={seat.project} readOnly={!isSeatOccupied} />
            </div>
            {isSeatOccupied && (
              <button type="button" className={styles.editButton} onClick={handleEdit}>
                Edit
              </button>
            )}
          </>
        )}
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <div className={styles.arrowToggle} onClick={toggleCommentsSection}>
          <FontAwesomeIcon icon={showComments ? faArrowUp : faArrowDown} />
          {showComments && seat.viewerNames?.length > 0 && (
            <button
            className={styles.addCommentButton}
            onClick={() => console.log('Add Comment clicked')}
          >
            Add Comment
          </button>
          
          )}
        </div>
        {showComments && seat.viewerNames?.length > 0 && (
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
      ctx.fillStyle = '#ffffff'; // Set the color of the numbering box
      ctx.fillRect(scaledX, scaledY, numberBoxSize, numberBoxSize);
      ctx.fillStyle = '#000000'; // Set the color of the numbering text
      ctx.font = `${11 / zoomLevel}px Arial`; // Set the font size

      // Display the seat_id as a number
      

      // Draw seat box
      const seatBoxY = scaledY + numberBoxSize; // Adjust the position of the seat box
      const seatBoxHeight = seatSize - numberBoxSize; // Adjust the height of the seat box
      ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
      ctx.fillRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1 / zoomLevel;
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
        ctx.fillText(seat.project_name, scaledX + textOffsetX, scaledY + textOffsetY);
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
    const centerOffsetX = (seatSize - occupantNameWidth) / 1;
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
    
        ctx.fillText(projectNameAcronym, scaledX + seatSize / 3, scaledY + seatSize - textOffsetY/ 1 + 40);
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
