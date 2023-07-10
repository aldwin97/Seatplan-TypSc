import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import { Grid, Paper } from '@material-ui/core';
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvided, DraggableStateSnapshot, DroppableProvided } from 'react-beautiful-dnd';
import styles from './seatplanPage.module.css';

interface Seat {
  id: string;
  label: string;
}

const initialSeats: Seat[] = [
  { id: 'seat1', label: 'Seat 1' },
  { id: 'seat2', label: 'Seat 2' },
  { id: 'seat3', label: 'Seat 3' },
  { id: 'seat4', label: 'Seat 4' },
  { id: 'seat5', label: 'Seat 5' },
];

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

  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const [seats, setSeats] = useState<Seat[]>(initialSeats);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const updatedSeats = [...seats];
    const [draggedSeat] = updatedSeats.splice(result.source.index, 1);
    updatedSeats.splice(result.destination.index, 0, draggedSeat);
    setSeats(updatedSeats);
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

      <div className={styles.root}>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="seatPlan">
            {(provided: DroppableProvided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Grid container spacing={2}>
                  {seats.map((seat, index) => (
                    <Draggable key={seat.id} draggableId={seat.id} index={index}>
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <Grid item xs={6} sm={4} md={3}>
                          <Paper
                            className={styles.paper}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {seat.label}
                          </Paper>
                        </Grid>
                      )}
                    </Draggable>
                  ))}
                </Grid>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}

export default SeatplanPage;
