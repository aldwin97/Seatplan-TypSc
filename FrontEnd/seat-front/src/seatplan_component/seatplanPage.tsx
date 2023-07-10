import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import styles from './seatplanPage.module.css';

interface Seat {
  id: string;
  label: string;
  position: { x: number; y: number };
  isDragging: boolean;
  color: string;
}

function SeatplanPage() {
  const initialSeats: Seat[] = [];

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
const [isDropdownOpen, setDropdownOpen] = useState(false);
const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
const [seats, setSeats] = useState<Seat[]>(initialSeats);
const [newSeatLabel, setNewSeatLabel] = useState('');
const [newSeatColor, setNewSeatColor] = useState('#000000');
const [zoomLevel, setZoomLevel] = useState(1);
const [isDraggingCanvas, setDraggingCanvas] = useState(false);
const [canvasOffset, setCanvasOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

      ctx.fillStyle = seat.isDragging ? '#ff0000' : color;
      ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillText(seat.label, scaledX + textOffsetX, scaledY + textOffsetY);
    });
  }
}, [seats]);


  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (event.button === 1) {
      setDraggingCanvas(true);
      setCanvasOffset({ x: event.clientX, y: event.clientY });
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
  
      const seatIndex = seats.findIndex((seat) => {
        const { x, y } = seat.position;
        const seatWidth = 50;
        const seatHeight = 50;
        const seatRight = x + seatWidth;
        const seatBottom = y + seatHeight;
  
        return offsetX >= x && offsetX <= seatRight && offsetY >= y && offsetY <= seatBottom;
      });
  
      if (seatIndex > -1) {
        const updatedSeats = seats.map((seat, index) => {
          if (index === seatIndex) {
            return {
              ...seat,
              isDragging: true,
              dragOffsetX: offsetX - seat.position.x,
              dragOffsetY: offsetY - seat.position.y,
            };
          }
          return seat;
        });
  
        setSeats(updatedSeats);
      }
    }
  };
  
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDraggingCanvas) {
      const dx = event.clientX - canvasOffset.x;
      const dy = event.clientY - canvasOffset.y;
      setCanvasOffset({ x: event.clientX, y: event.clientY });
      setSeats((prevSeats) =>
        prevSeats.map((seat) => ({
          ...seat,
          position: { x: seat.position.x + dx, y: seat.position.y + dy },
        }))
      );
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
  
      const gridSize = 50; // Adjust the size of the grid as needed
  
      const updatedSeats = seats.map((seat) => {
        if (seat.isDragging) {
          const x = Math.round(offsetX / gridSize) * gridSize;
          const y = Math.round(offsetY / gridSize) * gridSize;
  
          return { ...seat, position: { x, y } };
        }
  
        return seat;
      });
  
      setSeats(updatedSeats);
    }
  };
  
  const handleMouseUp = () => {
    setDraggingCanvas(false);
    const updatedSeats = seats.map((seat) => ({ ...seat, isDragging: false }));
    setSeats(updatedSeats);
  };

  const addNewSeat = () => {
    if (newSeatLabel.trim() === '') return;
  
    const newSeat: Seat = {
      id: `seat${seats.length + 1}`,
      label: newSeatLabel,
      position: { x: 0, y: 0 }, // Set position at the top left corner
      isDragging: false,
      color: newSeatColor,
    };
  
    setSeats([...seats, newSeat]);
    setNewSeatLabel('');
  };
  
  
  

  const handleZoomIn = () => {
    setZoomLevel((prevZoomLevel) => prevZoomLevel + 0.1);
  };
  
  const handleZoomOut = () => {
    if (zoomLevel > 0.1) {
      setZoomLevel((prevZoomLevel) => prevZoomLevel - 0.1);
    }
  };
  
  
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
  
        ctx.fillStyle = seat.isDragging ? '#ff0000' : color;
        ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(seat.label, scaledX + textOffsetX, scaledY + textOffsetY);
      });
    }
  }, [seats, zoomLevel]);
  





  
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

  <div className={styles.root}>
    <div className={styles.canvasWrapper}>
    <canvas
  ref={canvasRef}
  width={800}
  height={600}
  onMouseDown={handleMouseDown}
  onMouseMove={handleMouseMove}
  onMouseUp={handleMouseUp}
>
       {seats.map((seat) => (
  <div
    key={seat.id}
    className={`${styles.draggableItem} ${styles.seatBox}`} // Add the seatBox class
    draggable={false}
    data-seat-id={seat.id}
    style={{
      position: 'absolute',
      left: seat.position.x,
      top: seat.position.y,
      cursor: 'pointer',
    }}
  >
    {seat.label}
  </div>
))}

      </canvas>
      <div className={styles.zoomButtons}>
        <button onClick={handleZoomIn}>+</button>
        <button onClick={handleZoomOut}>-</button>
      </div>
    </div>
  </div>

  <div className={styles.addSeatForm}>
    <input
      type="text"
      value={newSeatLabel}
      onChange={(event) => setNewSeatLabel(event.target.value)}
      placeholder="Enter seat label"
    />
    <input
      type="color"
      value={newSeatColor}
      onChange={(event) => setNewSeatColor(event.target.value)}
    />
    <button onClick={addNewSeat}>Add Seat</button>
  </div>
</div>

  );
}

export default SeatplanPage;