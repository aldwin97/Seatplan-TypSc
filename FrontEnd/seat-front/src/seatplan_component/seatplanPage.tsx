import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import styles from './seatplanPage.module.css';

interface Seat {
  id: string;
  label: string;
  position: { x: number; y: number };
  isSwapping: boolean;
  color: string;
  occupant: string;
  project: string;
}

interface SeatPopupProps {
  seat: Seat;
  onClose: () => void;
}

function SeatPopup({ seat, onClose }: SeatPopupProps) {
  const [occupant, setOccupant] = useState(seat.occupant);
  const [project, setProject] = useState(seat.project);

  const handleOccupantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOccupant(event.target.value);
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProject(event.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedSeat = { ...seat, occupant, project };
    console.log('Updated seat:', updatedSeat);
  };

  return (
    <div className={styles.seatPopup}>
      <div className={styles.seatPopupContent}>
        <h3>{seat.label}</h3>
        <form onSubmit={handleFormSubmit}>
          <label>
            Occupant:
            <input type="text" value={occupant} onChange={handleOccupantChange} />
          </label>
          <label>
            Project:
            <input type="text" value={project} onChange={handleProjectChange} />
          </label>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>Close</button>
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
  const [seats, setSeats] = useState<Seat[]>([
    { id: 'seat1', label: 'Seat 1', position: { x: 50, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat2', label: 'Seat 2', position: { x: 50, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat3', label: 'Seat 3', position: { x: 50, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat4', label: 'Seat 4', position: { x: 110, y: 50 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat5', label: 'Seat 5', position: { x: 110, y: 100 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat6', label: 'Seat 6', position: { x: 110, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat7', label: 'Seat 7', position: { x: 200, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat8', label: 'Seat 8', position: { x: 200, y: 100 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat9', label: 'Seat 9', position: { x: 200, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat10', label: 'Seat 10', position: { x: 260, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat11', label: 'Seat 11', position: { x: 260, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat12', label: 'Seat 12', position: { x: 260, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat13', label: 'Seat 13', position: { x: 260, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat14', label: 'Seat 14', position: { x: 260, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat15', label: 'Seat 15', position: { x: 260, y: 300 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat16', label: 'Seat 16', position: { x: 260, y: 350 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    
    { id: 'seat17', label: 'Seat 17', position: { x: 360, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat18', label: 'Seat 18', position: { x: 360, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat19', label: 'Seat 19', position: { x: 360, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat20', label: 'Seat 20', position: { x: 360, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat21', label: 'Seat 21', position: { x: 360, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat22', label: 'Seat 22', position: { x: 360, y: 300 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat23', label: 'Seat 23', position: { x: 360, y: 350 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat24', label: 'Seat 24', position: { x: 360, y: 400 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    
    { id: 'seat25', label: 'Seat 25', position: { x: 420, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat26', label: 'Seat 26', position: { x: 420, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat27', label: 'Seat 27', position: { x: 420, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat28', label: 'Seat 28', position: { x: 420, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat29', label: 'Seat 29', position: { x: 420, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat30', label: 'Seat 30', position: { x: 420, y: 300 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat31', label: 'Seat 31', position: { x: 420, y: 350 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat32', label: 'Seat 32', position: { x: 420, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat33', label: 'Seat 33', position: { x: 420, y: 450 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat34', label: 'Seat 34', position: { x: 520, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat35', label: 'Seat 35', position: { x: 520, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat36', label: 'Seat 36', position: { x: 520, y: 150 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat37', label: 'Seat 37', position: { x: 520, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat38', label: 'Seat 38', position: { x: 520, y: 250 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat39', label: 'Seat 39', position: { x: 520, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat40', label: 'Seat 40', position: { x: 520, y: 350 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat41', label: 'Seat 41', position: { x: 520, y: 400 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    

    { id: 'seat42', label: 'Seat 42', position: { x: 580, y: 50 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat43', label: 'Seat 43', position: { x: 580, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat44', label: 'Seat 44', position: { x: 580, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat45', label: 'Seat 45', position: { x: 580, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat46', label: 'Seat 46', position: { x: 580, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat47', label: 'Seat 47', position: { x: 580, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat48', label: 'Seat 48', position: { x: 580, y: 350 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat49', label: 'Seat 49', position: { x: 580, y: 400 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    
    {id: 'seat50', label: 'Seat 50', position: { x: 680, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat51', label: 'Seat 51', position: { x: 680, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat52', label: 'Seat 52', position: { x: 680, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat53', label: 'Seat 53', position: { x: 680, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat54', label: 'Seat 54', position: { x: 680, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat55', label: 'Seat 55', position: { x: 680, y: 300 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    
    { id: 'seat56', label: 'Seat 56', position: { x: 740, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat57', label: 'Seat 57', position: { x: 740, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat58', label: 'Seat 58', position: { x: 740, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat59', label: 'Seat 59', position: { x: 740, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat60', label: 'Seat 60', position: { x: 740, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat61', label: 'Seat 61', position: { x: 740, y: 300 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat62', label: 'Seat 62', position: { x: 840, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat63', label: 'Seat 63', position: { x: 840, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat64', label: 'Seat 64', position: { x: 840, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat65', label: 'Seat 65', position: { x: 840, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat66', label: 'Seat 66', position: { x: 840, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat67', label: 'Seat 67', position: { x: 940, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat68', label: 'Seat 68', position: { x: 940, y: 100 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat69', label: 'Seat 69', position: { x: 940, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat70', label: 'Seat 70', position: { x: 940, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat71', label: 'Seat 71', position: { x: 940, y: 250 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat72', label: 'Seat 72', position: { x: 1040, y: 50 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat73', label: 'Seat 73', position: { x: 1040, y: 100 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat74', label: 'Seat 74', position: { x: 1040, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat75', label: 'Seat 75', position: { x: 1040, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat76', label: 'Seat 76', position: { x: 1100, y: 50 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat77', label: 'Seat 77', position: { x: 1100, y: 100 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat78', label: 'Seat 78', position: { x: 1100, y: 150 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
    { id: 'seat79', label: 'Seat 79', position: { x: 1100, y: 200 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },

    { id: 'seat80', label: 'Seat 80', position: { x: 1200, y: 50 }, isSwapping: false, color: '#FFFFFF', occupant: '', project: ''  },
    { id: 'seat81', label: 'Seat 81', position: { x: 1200, y: 100 }, isSwapping: false, color: '#FFFFFF' , occupant: '', project: '' },
  ]);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [canvasOffset, setCanvasOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.scale(zoomLevel, zoomLevel);

      seats.forEach((seat) => {
        const { x, y } = seat.position;
        const { color } = seat;

        const scaledX = x / zoomLevel;
        const scaledY = y / zoomLevel;
        const seatSize = 50 / zoomLevel;
        const textOffsetX = 10 / zoomLevel;
        const textOffsetY = 30 / zoomLevel;

        ctx.fillStyle = seat.isSwapping ? '#ff0000' : color;
        ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
        ctx.strokeStyle = '#000000'; // Set the border color to black
        ctx.lineWidth = 2 / zoomLevel; // Adjust the border width as needed
        ctx.strokeRect(scaledX, scaledY, seatSize, seatSize);
        ctx.fillStyle = '#000000'; // Set the text color to black
        ctx.fillText(seat.label, scaledX + textOffsetX, scaledY + textOffsetY);

        if (selectedSeat && seat.id === selectedSeat.id) {
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
    if (event.target instanceof HTMLElement && event.target.closest('.zoomButtons')) {
      return;
    }
  
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
};
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

  
    if (!doubleClickFlag) {
      setSelectedSeat(null);
    }
  
    setDoubleClickFlag(false); // Reset the double-click flag
    setDraggingSeatIndex(-1); // Reset the dragging seat index
  };
};
  
  return (
    <div className={styles.container}>
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
            <FontAwesomeIcon icon={faProjectDiagram} className={styles.icon} />
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
        <SeatPopup seat={selectedSeat} onClose={() => setSelectedSeat(null)} />
      )}
       <div className={styles.canvasWrapper} ref={containerRef}>
  <div className={styles.root} ref={containerRef}>
    <div className={styles.scrollableCanvas}>
      <canvas
        ref={canvasRef}
        width={1300}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
          </canvas>
</div>
</div>
</div>
</div>
);
}

export default SeatplanPage;
