import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faFaceSmile, faChartBar, faUsers, faProjectDiagram, faPowerOff, faSmile, faEdit } from '@fortawesome/free-solid-svg-icons';
import styles from './seatplanPage.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface Seat {
  id: number;
  label: string;
  position: { x: number; y: number };
  isSwapping: boolean;
  color: string;
  occupant: string;
  project: string;
  comments: string[];
  viewerNames: string[];
  seatstatus: string;
}

interface SeatPopupProps {
  seat: Seat;
  onClose: () => void;
  setSeats: (seats: Seat[]) => void;
  seats: Seat[];
}

const predefinedColors = [
  { color: '#FF0000', name: 'Red' },
  { color: '#00FF00', name: 'Green' },
  { color: '#0000FF', name: 'Blue' },
  { color: '#FFFF00', name: 'Yellow' },
  { color: '#FF00FF', name: 'Magenta' },
  { color: '#00FFFF', name: 'Cyan' },
  { color: '#FFA500', name: 'Orange' },
  { color: '#800080', name: 'Purple' },
  { color: '#008000', name: 'Dark Green' },
  { color: '#000080', name: 'Navy' },
  { color: '#800000', name: 'Maroon' },
  { color: '#808080', name: 'Gray' },
  { color: '#FFC0CB', name: 'Pink' },
  { color: '#FFFFF0', name: 'Ivory' },
  { color: '#008080', name: 'Teal' },
  { color: '#808000', name: 'Olive' },
];

function SeatPopup({ seat, onClose, setSeats, seats }: SeatPopupProps): JSX.Element {
  const [occupant, setOccupant] = useState(seat.occupant);
  const [project, setProject] = useState(seat.project);
  const [selectedSeatId, setSelectedSeatId] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [selectedViewerIndex, setSelectedViewerIndex] = useState(-1);
  const [reply, setReply] = useState('');
  const [color, setColor] = useState(seat.color);

  useEffect(() => {
    document.body.classList.toggle('popupOpen', true);
    return () => {
      document.body.classList.toggle('popupOpen', false);
    };
  }, []);

  const handleOccupantChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOccupant(event.target.value);
  };

  const handleProjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProject(event.target.value);
  };

  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setColor(event.target.value);
  };

  const handleSeatSelect = (selectedSeatId: string) => {
    setSelectedSeatId(selectedSeatId);
  };

  const handleSwapSeats = () => {
    if (selectedSeatId) {
      const currentSeatId = seat.id;
const currentSeat = seats.find((seat) => seat.id === currentSeatId);
const swapSeat = seats.find((seat) => String(seat.id) === String(selectedSeatId));

if (currentSeat && swapSeat && String(currentSeatId) !== String(selectedSeatId)) {
        const updatedCurrentSeat = {
          ...currentSeat,
          occupant: swapSeat.occupant,
          project: swapSeat.project,
          label: swapSeat.label,
          color: swapSeat.color,
        };
        const updatedSwapSeat = {
          ...swapSeat,
          occupant: currentSeat.occupant,
          project: currentSeat.project,
          label: currentSeat.label,
          color: currentSeat.color,
        };

        const updatedSeats = seats.map((seat) => {
          if (seat.id === updatedCurrentSeat.id) {
            return updatedCurrentSeat;
          } else if (seat.id === updatedSwapSeat.id) {
            return updatedSwapSeat;
          }
          return seat;
        });

        setSeats(updatedSeats);
      }
    }
    onClose();
  };

  const isSeatOccupied = seat.occupant !== '' && seat.project !== '';

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedSeats = seats.map((s) => {
      if (s.id === seat.id) {
        return { ...s, occupant, project, color };
      }
      if (s.project === project) {
        return { ...s, color };
      }
      return s;
    });
    setSeats(updatedSeats);
    onClose();
  };

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
      if (s.id === seat.id) {
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

  return (
    <div className={`${styles.seatPopupContainer} ${styles.popupOpen}`}>
      <div className={styles.seatPopupContent}>
        <h3>{seat.label}</h3>
        <form onSubmit={handleFormSubmit}>
          {isEditMode ? (
            <>
              <label>
                Occupant:
                <input type="text" value={occupant} onChange={handleOccupantChange} required />
              </label>
              <label>
                Project:
                <input type="text" value={project} onChange={handleProjectChange} required />
              </label>
              <label>
              Color:
              <select value={color} onChange={handleColorChange} required>
                {predefinedColors.map((colorOption) => (
                  <option key={colorOption.color} value={colorOption.color}>
                    {colorOption.name}
                  </option>
                ))}
              </select>
            </label>

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
                        <option key={seat.id} value={seat.id}>
                          {seat.label}
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
  const [seats, setSeats] = useState<Seat[]>([
    { id: 1, label: 'Seat 1', seatstatus:'', position: { x: 100, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 2, label: 'Seat 2', seatstatus:'', position: { x: 100, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 3, label: 'Seat 3',seatstatus:'', position: { x: 100, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },

    { id: 4, label: 'Seat 4',seatstatus:'', position: { x: 230, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 5, label: 'Seat 5',seatstatus:'', position: { x: 230, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 6, label: 'Seat 6',seatstatus:'', position: { x: 230, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },

    { id: 7, label: 'Seat 7',seatstatus:'', position: { x: 460, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 8, label: 'Seat 8',seatstatus:'', position: { x: 460, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 9, label: 'Seat 9',seatstatus:'', position: { x: 460, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},

    { id: 10, label: 'Seat 10',seatstatus:'', position: { x: 590, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 11, label: 'Seat 11',seatstatus:'', position: { x: 590, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 12, label: 'Seat 12',seatstatus:'', position: { x: 590, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 13, label: 'Seat 13',seatstatus:'', position: { x: 590, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 14, label: 'Seat 14',seatstatus:'', position: { x: 590, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 15, label: 'Seat 15',seatstatus:'', position: { x: 590, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 16, label: 'Seat 16',seatstatus:'', position: { x: 590, y: 700 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},

    { id: 17, label: 'Seat 17',seatstatus:'', position: { x: 820, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 18, label: 'Seat 18',seatstatus:'', position: { x: 820, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 19, label: 'Seat 19',seatstatus:'', position: { x: 820, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 20, label: 'Seat 20',seatstatus:'', position: { x: 820, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 21, label: 'Seat 21',seatstatus:'', position: { x: 820, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 22, label: 'Seat 22',seatstatus:'', position: { x: 820, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 23, label: 'Seat 23',seatstatus:'', position: { x: 820, y: 700 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 24, label: 'Seat 24',seatstatus:'', position: { x: 820, y: 800 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},

    { id: 25, label: 'Seat 25',seatstatus:'', position: { x: 950, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 26, label: 'Seat 26',seatstatus:'', position: { x: 950, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 27, label: 'Seat 27',seatstatus:'', position: { x: 950, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 28, label: 'Seat 28',seatstatus:'', position: { x: 950, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 29, label: 'Seat 29',seatstatus:'', position: { x: 950, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 30, label: 'Seat 30',seatstatus:'', position: { x: 950, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 31, label: 'Seat 31',seatstatus:'', position: { x: 950, y: 700 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 32, label: 'Seat 32',seatstatus:'', position: { x: 950, y: 800 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 33, label: 'Seat 33',seatstatus:'', position: { x: 950, y: 900 }, isSwapping: false, color: '#e5f6ed', occupant: 'MATSUO, Hiroki', project: 'HSE/voLTE 3+ HSC/MyNavi', comments: [] , viewerNames: []},

    { id: 34, label: 'Seat 34',seatstatus:'', position: { x: 1180, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 35, label: 'Seat 35',seatstatus:'', position: { x: 1180, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 36, label: 'Seat 36',seatstatus:'', position: { x: 1180, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 37, label: 'Seat 37',seatstatus:'', position: { x: 1180, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 38, label: 'Seat 38',seatstatus:'', position: { x: 1180, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 39, label: 'Seat 39',seatstatus:'', position: { x: 1180, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 40, label: 'Seat 40',seatstatus:'', position: { x: 1180, y: 700 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 41, label: 'Seat 41',seatstatus:'', position: { x: 1180, y: 800 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},

    { id: 42, label: 'Seat 42',seatstatus:'', position: { x: 1310, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 43, label: 'Seat 43',seatstatus:'', position: { x: 1310, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 44, label: 'Seat 44',seatstatus:'', position: { x: 1310, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 45, label: 'Seat 45',seatstatus:'', position: { x: 1310, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 46, label: 'Seat 46',seatstatus:'', position: { x: 1310, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 47, label: 'Seat 47',seatstatus:'', position: { x: 1310, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 48, label: 'Seat 48',seatstatus:'', position: { x: 1310, y: 700 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 49, label: 'Seat 49',seatstatus:'', position: { x: 1310, y: 800 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },

    { id: 50, label: 'Seat 50',seatstatus:'', position: { x: 1540, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 51, label: 'Seat 51',seatstatus:'', position: { x: 1540, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 52, label: 'Seat 52',seatstatus:'', position: { x: 1540, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 53, label: 'Seat 53',seatstatus:'', position: { x: 1540, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 54, label: 'Seat 54',seatstatus:'', position: { x: 1540, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 55, label: 'Seat 55',seatstatus:'', position: { x: 1540, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },

    { id: 56, label: 'Seat 56',seatstatus:'', position: { x: 1670, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 57, label: 'Seat 57',seatstatus:'', position: { x: 1670, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 58, label: 'Seat 58',seatstatus:'', position: { x: 1670, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: []},
    { id: 59, label: 'Seat 59',seatstatus:'', position: { x: 1670, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 60, label: 'Seat 60',seatstatus:'', position: { x: 1670, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 61, label: 'Seat 61',seatstatus:'', position: { x: 1670, y: 600 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },

    { id: 62, label: 'Seat 62',seatstatus:'', position: { x: 1900, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 63, label: 'Seat 63',seatstatus:'', position: { x: 1900, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 64, label: 'Seat 64',seatstatus:'', position: { x: 1900, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 65, label: 'Seat 65',seatstatus:'', position: { x: 1900, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 66, label: 'Seat 66',seatstatus:'', position: { x: 1900, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },

    { id: 67, label: 'Seat 67',seatstatus:'', position: { x: 2030, y: 100 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 68, label: 'Seat 68',seatstatus:'', position: { x: 2030, y: 200 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [], viewerNames: [] },
    { id: 69, label: 'Seat 69',seatstatus:'', position: { x: 2030, y: 300 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 70, label: 'Seat 70',seatstatus:'', position: { x: 2030, y: 400 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},
    { id: 71, label: 'Seat 71',seatstatus:'', position: { x: 2030, y: 500 }, isSwapping: false, color: '#FFFFFF', occupant: 'EMPTY', project: 'EMPTY', comments: [] , viewerNames: []},

    { id: 72, label: 'Seat 72',seatstatus:'', position: { x: 2260, y: 100 }, isSwapping: false, color: '#e6e6e6', occupant: 'MAGDAY, Nico', project: 'VSBU', comments: [] , viewerNames: []},
    { id: 73, label: 'Seat 73',seatstatus:'', position: { x: 2260, y: 200 }, isSwapping: false, color: '#e6e6e6', occupant: 'ABLAO, Christian', project: 'VSBU', comments: [], viewerNames: [] },
    { id: 74, label: 'Seat 74',seatstatus:'', position: { x: 2260, y: 300 }, isSwapping: false, color: '#e6e6e6', occupant: 'BALACUTAN, Jose Antonio', project: 'VSBU', comments: [] , viewerNames: []},
    { id: 75, label: 'Seat 75',seatstatus:'', position: { x: 2260, y: 400 }, isSwapping: false, color: '#e6e6e6', occupant: 'FAMILARA, Aedan Kim', project: 'VSBU', comments: [] , viewerNames: []},

    { id: 76, label: 'Seat 76',seatstatus:'', position: { x: 2390, y: 100 }, isSwapping: false, color: '#ffffe6', occupant: 'S2BU', project: 'S2BU', comments: [] , viewerNames: []},
    { id: 77, label: 'Seat 77',seatstatus:'', position: { x: 2390, y: 200 }, isSwapping: false, color: '#ffffe6', occupant: 'S2BU', project: 'S2BU', comments: [] , viewerNames: []},
    { id: 78, label: 'Seat 78',seatstatus:'', position: { x: 2390, y: 300 }, isSwapping: false, color: '#ffffe6', occupant: 'S2BU', project: 'S2BU', comments: [], viewerNames: [] },
    { id: 79, label: 'Seat 79',seatstatus:'', position: { x: 2390, y: 400 }, isSwapping: false, color: '#ffffe6', occupant: 'S2BU', project: 'S2BU', comments: [], viewerNames: []},

    { id: 80, label: 'Seat 80',seatstatus:'', position: { x: 2620, y: 100 }, isSwapping: false, color: '#ffffe6', occupant: 'DTR-NOC', project: 'DTR-NOC', comments: [] , viewerNames: []},
    { id: 81, label: 'Seat 81',seatstatus:'', position: { x: 2620, y: 200 }, isSwapping: false, color: '#ff0000', occupant: 'EMPTY', project: '', comments: [] , viewerNames: []},

    { id: 85, label: 'Seat 85',seatstatus:'', position: { x: 100, y: 800 }, isSwapping: false, color: '#FFFF66', occupant: 'MAGSAMBOL, Jonathan', project: 'HSC/Shell', comments: [] , viewerNames: []},
    { id: 84, label: 'Seat 84',seatstatus:'', position: { x: 100, y: 1000 }, isSwapping: false, color: '#FF6666', occupant: 'OMIYA, Yuichiro', project: 'JTS', comments: [] , viewerNames: []},
    { id: 83, label: 'Seat 83',seatstatus:'', position: { x: 100, y: 1100 }, isSwapping: false, color: '#FFFF66', occupant: 'IKEDA, Kazuki', project: 'Hitachi', comments: [] , viewerNames: []},
    { id: 82, label: 'Seat 82',seatstatus:'', position: { x: 100, y: 1200 }, isSwapping: false, color: '#F0FFF1', occupant: 'HINTO, Cristina', project: 'NRI', comments: [] , viewerNames: []},
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
        ctx.fillText(seat.label, scaledX + numberBoxSize / 2, scaledY + numberBoxSize / 2 + 1);
  
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
          const swappedSeat = seats.find((s) => String(s.id) === String(seat.occupant));

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
      seat.occupant.toLowerCase().includes(lowerCaseSearchQuery) ||
      seat.label.toLowerCase().includes(lowerCaseSearchQuery)
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
        ctx.fillText(seat.label, scaledX + numberBoxSize / 2, scaledY + numberBoxSize / 2 + 1);
  
        const seatBoxY = scaledY + numberBoxSize;
        const seatBoxHeight = seatSize - numberBoxSize;
        ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
        ctx.fillRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2 / zoomLevel;
        ctx.strokeRect(scaledX, seatBoxY, seatSize, seatBoxHeight);
        ctx.fillStyle = '#000000';
  
        if (seat.isSwapping) {
          const swappedSeat = filteredSeats.find((s) => String(s.id) === String(seat.occupant));
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
  
        if (selectedSeat && seat.id === selectedSeat.id) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(scaledX, scaledY, seatSize, seatSize);
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText('Edit', scaledX + seatSize / 2 - 10, scaledY + seatSize / 2 + 5);
        }
      });
    }
  }, [filteredSeats, zoomLevel, selectedSeat]);
  
  
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
      >
          </canvas>
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
