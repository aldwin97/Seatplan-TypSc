import React, { useState, useEffect, useRef } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import style from '../dashboard_component/dashboardPage.module.css';
import { BusinessCenterOutlined, DashboardOutlined,ChairOutlined, GroupsOutlined, AccountCircleOutlined,WorkOutlineOutlined, Menu, Logout } from '@mui/icons-material';
import { useNavigate, } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import styles from './seatplanPage.module.css';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { FaInfoCircle } from 'react-icons/fa';
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import svgPathConverter from 'svg-path-converter';
import { Avatar} from '@mui/material';
import axios from 'axios';
import defaulImage from "../assets/default.png";

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
  const [occupantsList, setOccupantsList] = useState<Occupant[]>([]);
  const [ , setIsOccupantAlreadyAssigned] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [swapSuccess, setSwapSuccess] = useState(false);


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
          setSwapSuccess(true);
          console.log('Seats swapped successfully');
          console.log('Data being swapped:');
          console.log('Current Seat:', updatedCurrentSeat);
          console.log('Swap Seat:', updatedSwapSeat);
  
          // Refresh the page to fetch the updated seat data
          setTimeout(() => {
            window.location.reload();
          }, 2000);
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

  const [isEditMode, setIsEditMode] = useState(false);
  const [isSwapMode, setIsSwapMode] = useState(false);

  const handleSwap = () => {
    setIsSwapMode(true);
  };
  
  const handleEdit = () => {
    setIsEditMode(true);
  };
 
  const handleOccupantChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOccupant(event.target.value);
  };
  
  // Function to fetch occupants and projects from the backend
  useEffect(() => {
    fetchOccupants();
  }, [seats]); // Make sure to include 'seats' in the dependency array
  

  /// Function to fetch the list of occupants from the backend
  const fetchOccupants = async () => {
    try {
      const response = await fetch('http://localhost:8080/seat/showAllUser');
      if (response.ok) {
        const occupantsData: Occupant[] = await response.json();
  
        // Filter out occupants who are already assigned to a seat (have seat_id)
        const unassignedOccupants = occupantsData.filter((occupant) => {
          return !seats.some((s) => s.occupant === occupant.user_id.toString() && s.seat_id);
        });
  
        setOccupantsList(unassignedOccupants);
      } else {
        console.error('Failed to fetch occupants');
      }
    } catch (error) {
      console.error('Error occurred while fetching occupants:', error);
    }
  };
  
  
  
  
  


useEffect(() => {
  setShowComments(false);
}, []);


const [showComments, setShowComments] = useState(false);

// Function to toggle the comments section
const toggleCommentsSection = () => {
  setShowComments((prevShowComments) => !prevShowComments);
};

return (
  <div className={`${styles.seatPopupContainer} ${styles.popupOpen}`}>
    <div className={styles.seatPopupContent}>
      <h3>Seat {seat.seat_id}</h3>
      <form onSubmit={handleFormSubmit}>

          <>
            <div className={styles.labelsContainer}>
              <label className={styles.labels}>Occupant: <input type="text" value={seat.occupant} readOnly={!isSeatOccupied} /></label>
            </div>
            <div className={styles.labelsContainer}>
              <label className={styles.labels}>Position: <input type="text" value={seat.position_name} readOnly={!isSeatOccupied} /></label>
            </div>
            <div className={styles.labelsContainer}>
              <label className={styles.labels}>Project: <input type="text" value={seat.project} readOnly={!isSeatOccupied} /></label>
            </div>
</>
        <button type="button" className={styles.closeButton} onClick={onClose}>
          <FontAwesomeIcon icon={faClose} />
        </button>
        <div className={styles.footer}>
        <div 
         className={`${styles.arrowToggle} ${showComments ? styles.toggled : ''}`}
        onClick={toggleCommentsSection}
        title={showComments ? 'Hide comments' : 'Show comments'}
      > <h5 className={styles.h5}>Comment Section</h5>
        <FontAwesomeIcon icon={showComments ? faChevronUp : faChevronDown} />
       
        {/* Optionally, you can add a button to add a new comment */}
      </div>
</div>
        {/* Render the comments section */}
        {showComments && seat.seat_id && <SeatPopupComments userId={parseInt(sessionStorage.getItem('user_id') || '0', 10)} seatIds={[seat.seat_id]} />}
      </form>
      
      </div>
    </div>
    
  );
}

interface Comment {
  comment_id: number;
  full_name: string;
  user_id: number;
  seat_id: number;
  comment: string;
  created_time: string;
  recipient_id: number;
  created_by: number;
  parent_id?: number; // Optional field to hold the parent comment's ID
  replies?: Comment[]; // Optional field to hold replies to this comment
}


interface SeatPopupCommentsProps {
  userId: number;
  seatIds: number[]; // Change to an array of seatIds
}


const SeatPopupComments = ({ userId, seatIds }: SeatPopupCommentsProps) => {
  
  const [commentsMap, setCommentsMap] = useState<{ [seatId: number]: Comment[] }>({});
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string>('');
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyToName, setReplyToName] = useState('');
  const [replyToCommentId, setReplyToCommentId] = useState<number | null>(null);
  const [replyToRecipientId, setReplyToRecipientId] = useState<number | null>(null);

  useEffect(() => {
    fetchCommentsForAllSeats(userId, seatIds);
  }, [userId, seatIds]);

  const handleCloseReplyBox = () => {
    setShowReplyBox(false);
    setReplyToName('');
    setReplyToCommentId(null);
    setNewComment('');
  };
  const handleShowReplyBox = (name: string, commentId: number, recipientId: number) => {
    setShowReplyBox(true);
    setReplyToName(name);
    setReplyToCommentId(commentId);
    setReplyToRecipientId(recipientId); // Set the recipientId state when showing the reply box
  };
  


  const fetchCommentsForAllSeats = (userId: number, seatIds: number[]) => {
    const fetchPromises = seatIds.map((seatId) => {
      return fetchCommentsBySeatId(seatId);
    });

    Promise.all(fetchPromises)
      .then((results) => {
        const commentsMap: { [seatId: number]: Comment[] } = {};
        results.forEach((comments, index) => {
          commentsMap[seatIds[index]] = comments;
        });
        setCommentsMap(commentsMap);
      })
      .catch((error) => {
        console.error('Error fetching comments for seats:', error);
      });
  };

  const fetchCommentsBySeatId = (seatId: number) => {
    return fetch(`http://localhost:8080/admin/showAllCommentBy/${seatId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to fetch comments for seat:', response.statusText);
          return [];
        }
      })
      .catch((error) => {
        console.error('Error fetching comments for seat:', error);
        return [];
      });
  };

  const handleNewCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (seatId: number) => {
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    const userIdString = sessionStorage.getItem('user_id');
    if (!userIdString) {
      setError('User ID not found in session storage');
      return;
    }

    const userId = parseInt(userIdString, 10);
    setError('');

    const commentData = {
      user_id: userId,
      seat_id: seatId,
      comment: newComment,
      created_time: new Date().toISOString(),
      created_by: userId,
      recipient_id: userId, // Set the recipient ID to the current user's ID
    };

    fetch('http://localhost:8080/seat/insertComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Comment inserted successfully');
          fetchCommentsForAllSeats(userId, seatIds);
          setNewComment('');
        } else {
          console.error('Failed to insert comment');
        }
      })
      .catch((error) => {
        console.error('Error inserting comment:', error);
      });
  };

  const handleReplySubmit = (seatId: number) => {
    if (!newComment.trim()) {
      setError('Reply cannot be empty');
      return;
    }
  
    if (replyToCommentId === null) {
      setError('Reply target not specified');
      return;
    }
  
    const replyData = {
      user_id: userId,
      seat_id: seatId,
      comment: newComment,
      created_time: new Date().toISOString(),
      created_by: userId,
      parent_id: replyToCommentId,
      recipient_id: replyToRecipientId,
    };
  
    fetch('http://localhost:8080/admin/replyComment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(replyData),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Reply inserted successfully');
          setShowReplyBox(false); // Close the reply modal
          setNewComment('');
          setReplyToCommentId(null);
          // Fetch the updated comments after submitting a reply
          fetchCommentsForAllSeats(userId, seatIds);
        } else {
          console.error('Failed to insert reply');
        }
      })
      .catch((error) => {
        console.error('Error inserting reply:', error);
      });
  };
  

  const renderFullConversation = (commentId: number | null) => {
    const renderReplies = (replies: Comment[] | undefined) => {
      if (!replies || replies.length === 0) {
        return null;
      }
  
      return (
        <ul className={styles.replyList}>
          {replies.map((reply) => (
            <li key={reply.comment_id}>
              <table className={styles.replyTable}>
                <tbody>
                  <tr>
                    <td>
                      <span className={styles.replyname}>{reply.full_name}: </span>
                      <span className={styles.replytext}>{reply.comment}</span>
                    </td>
                    <td className={styles.replyButtonCell}>
                      {/* Check if the reply is from the current user and has replies */}
                      {reply.user_id !== userId && reply.replies && reply.replies.length > 0 && (
                        <button className={styles.replyButton} onClick={() => handleShowReplyBox(reply.full_name, reply.comment_id, reply.recipient_id)}>Reply</button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              {/* Recursively render nested replies */}
              {renderReplies(reply.replies)}
            </li>
          ))}
        </ul>
      );
    };
  
  
    if (commentId === null || !commentsMap[seatIds[0]]) {
      return null;
    }
  
    const findComment = (commentId: number, comments: Comment[]): Comment | null => {
      for (const comment of comments) {
        if (comment.comment_id === commentId) {
          return comment;
        }
        if (comment.replies) {
          const nestedComment = findComment(commentId, comment.replies);
          if (nestedComment) {
            return nestedComment;
          }
        }
      }
      return null;
    };
  
    const rootComment = findComment(commentId, commentsMap[seatIds[0]]);
    if (!rootComment) {
      return null;
    }
  
    // Show the entire conversation in the popup modal
    return renderReplies([rootComment]);
  };


  const renderMainComments = (comments: Comment[], userId: number) => {
    const findOriginalComment = (commentId: number, replies: Comment[]): Comment | null => {
      for (const reply of replies) {
        if (reply.comment_id === commentId) {
          return reply;
        }
        if (reply.replies) {
          const originalComment = findOriginalComment(commentId, reply.replies);
          if (originalComment) {
            return originalComment;
          }
        }
      }
      return null;
    };
  
    const findFullNameById = (userId: number): string | undefined => {
      const comment = comments.find((c) => c.user_id === userId);
      return comment ? comment.full_name : undefined;
    };
  
    const findReplyingTo = (commentId: number): string | undefined => {
      const originalComment = findOriginalComment(commentId, comments);
      return originalComment ? findFullNameById(originalComment.user_id) : undefined;
    };
  
    const findReplyToUser = (commentId: number, replies: Comment[]): Comment | undefined => {
      for (const reply of replies) {
        if (reply.comment_id === commentId) {
          return reply;
        }
        if (reply.replies) {
          const userReply = findReplyToUser(commentId, reply.replies);
          if (userReply) {
            return userReply;
          }
        }
      }
      return undefined;
    };
  
    return (
      <table className={styles.commentsTable}>
      <tbody>
        {comments.map((comment) => (
          <tr key={comment.comment_id}>
            <td>
              <span className={styles.boldName}>{comment.full_name}: </span>
              <span className={styles.text}>{comment.comment}</span>
              {/* Display "Replied to" information */}
              {comment.parent_id && (
                <div className={styles.repliedTo}>
                  {findFullNameById(comment.user_id)} Replied to {findFullNameById(comment.recipient_id)}
                </div>
              )}
            </td>
            <td>
              {/* Check if the comment is not written by the current user */}
              {comment.user_id !== userId && !comment.replies && (
                <button className={styles.replyButton} onClick={() => handleShowReplyBox(comment.full_name, comment.comment_id, comment.user_id)}>Reply</button>
              )}
              {/* Display "Replied to" information based on recipient_id */}
              {comment.user_id === userId && comment.recipient_id !== userId && (
                <div className={styles.repliedTo}>
                  You replied to {findFullNameById(comment.recipient_id) || "this seat"} ↷
                </div>
              )}
              {/* Display indicator for third-party users */}
              {comment.user_id !== userId && comment.parent_id && (
                <div className={styles.repliedTo}>
                  {findFullNameById(comment.user_id)} replied to {findReplyingTo(comment.parent_id)}
                </div>
              )}
              {/* Display indicator for the user who received the reply */}
              {comment.recipient_id === userId && (
                <div className={styles.repliedTo}>
                  {findFullNameById(comment.user_id)} replied to you ↶
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    
    );
  };
  

  
   
  return (
    <div>
      <form >
       
          <textarea
            value={newComment}
            onChange={handleNewCommentChange}
            placeholder="Leave a comment..."
            className={styles.largeInput}
            required
          />
        <button
          className={styles.addComment}
          type="button"
          onClick={() => handleCommentSubmit(seatIds[0])}
        >
          Add Comment
        </button>

      </form>
      {error && <p className={styles.error}>{error}</p>}
      {seatIds.map((seatId) => (
        <div key={seatId}>
          {commentsMap[seatId]?.length > 0 && (
            <div className={styles.commentsContainer}>
              <h4>Comments:</h4>
              <div className={styles.commentsScrollContainer}>
                {/* Call the renderMainComments function here */}
                {renderMainComments(commentsMap[seatId], userId)}
              </div>
            </div>
          )}
        </div>
      ))}
              {showReplyBox && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>Replying to {replyToName}</h2> {/* Use replyToName instead of userId */}
                <button className={styles.closeButton2} onClick={handleCloseReplyBox}>
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
              <div className={styles.modalBody}>
                {/* Show the entire conversation (thread) within the modal */}
                {renderFullConversation(replyToCommentId)}
                {/* Reply input */}
                <textarea
                  value={newComment}
                  onChange={handleNewCommentChange}
                  placeholder="Type your reply..."
                  className={styles.replyTextarea}
                  required
                />
                <button className={styles.replySubmitButton} onClick={() => handleReplySubmit(seatIds[0])}>
                  Reply
                </button>
              </div>
            </div>
          </div>
        )}

    </div>
  );
};




function ViewerSeatPage() {
  const navigate = useNavigate();

  const SeatplanPageHandleClick = () => {
    navigate('/seatPlanPage');
  };
  const ProfilePageHandleClick = () => {
    navigate('/profileviewerPage');
  };


  const dashboardPageHandleClick = () => {
    navigate('/dashboardviewerPage');
  };

  const adminPageHandleClick = () => {
    navigate('/AdminPage');
  };

  
  const [showInfoGuide, setShowInfoGuide] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const MachinePageHandleClick = () => {
    navigate('/machinetablePage');
  };
  
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
  

//sidebar

const [isDrawerOpen, setDrawerOpen] = useState(false);

const toggleDrawer = () => {
  setDrawerOpen(!isDrawerOpen);
};

const handleLogout = () => {
  // Clear any user-related data from the session/local storage
  sessionStorage.removeItem('user_id');
  sessionStorage.removeItem('usertype_id');


  // Redirect to the login page
  navigate('/');
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
    const canvas = canvasRef.current!;
    const ctx = canvas?.getContext('2d');
    const handleMouseEnter = () => {
      canvas.classList.add('seat-hover');
    };
  
    const handleMouseLeave = () => {
      canvas.classList.remove('seat-hover');
    };
  
    if (canvas && ctx) {
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      ctx.scale(zoomLevel, zoomLevel);
  
      filteredSeats.forEach((seat) => {
        const { x, y } = seat.position;
        const { color } = seat;
        const handleMouseEnter = () => {
          canvas.classList.add('seat-hover'); // Apply hover effect
        };
      
        const handleMouseLeave = () => {
          canvas.classList.remove('seat-hover'); // Remove hover effect
        };
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
        ctx.fillStyle = seat.isSwapping ? '#28a745' : color || '#e9e9e9';
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
        } return () => {
          canvas.removeEventListener('mouseenter', handleMouseEnter);
          canvas.removeEventListener('mouseleave', handleMouseLeave);
        };
    }});
    }
  }, [filteredSeats, zoomLevel, selectedSeat]);
  
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };



 // Helper function to convert data URL to Buffer-like object
 // Helper function to convert a hex color code to Excel-compatible ARGB format
const convertColorCodeToArgb = (colorCode: string): string => {
  // Assuming colorCode is in the format "#RRGGBB"
  const hexValue = colorCode.substring(1); // Remove the "#" character
  const alpha = 'FF'; // Set alpha to FF (fully opaque)
  return alpha + hexValue.toUpperCase();
};




const handleInfoButtonClick = () => {
  setShowInfoGuide(true);
};

const handleInfoGuideClose = () => {
  setShowInfoGuide(false);
};



//sidebar
interface UserData {
  first_name: string;
  last_name: string;
  position_name: string;
}

const [userPicture, setUserPicture] = useState<string | null>(null);
  const [UserData, setUserData] = useState<UserData | null>(null);
useEffect(() => {
  const fetchUserPicture = async () => {
    try {
      const user_id = window.sessionStorage.getItem('user_id');
      const pictureResponse = await axios.get(`http://localhost:8080/profile/userPicture/${user_id}`, {
        responseType: 'arraybuffer',
      });

      const base64Data = btoa(
        new Uint8Array(pictureResponse.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      const pictureDataUrl = `data:${pictureResponse.headers['content-type'].toLowerCase()};base64,${base64Data}`;
      setUserPicture(pictureDataUrl);
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  };

  fetchUserPicture();
}, []);

useEffect(() => {
  const user_id = window.sessionStorage.getItem('user_id');

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/dashboard/showLogedUserInfo/${user_id}`);

      const responseData: UserData = response.data[0];
      setUserData(responseData);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  fetchUserData();
}, []);

const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);


  return (
   <body className={styles.body}> <div className={styles.container}>
      <i className={styles['menu-out']}onClick={toggleDrawer}>
            <Menu  style={{ fontSize: '28px' }} />
          </i>
      
        <SwipeableDrawer
          anchor="left"
          open={isDrawerOpen}
          onClose={toggleDrawer}
          onOpen={toggleDrawer}
          variant="persistent"
          className={isDrawerOpen ? style['sidebar-open'] : style['sidebar-closed']}
        >
        
          <div className={style['page-sidebar']}>
            <div className={style['logo-box']}>
              <span className={style['logo-text']}>Seat</span>
              <i className={style['menu']} onClick={toggleDrawer}>
                <Menu style={{ fontSize: '28px' }}/>
              </i>
              <div className={`${style['page-sidebar-inner']} ${style['slimscroll']}`}>
                
                <ul className={style['accordion-menu']}>
                <div className="accordion-menu-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div className={style['userbg']}>
                      <div className={style['userpr']}>
                      {userPicture ? (
      <Avatar src={userPicture} alt="User" />
    ) : (
      <img
      src={defaulImage}
      alt="Profile Default"
      className={style.defaultImage}// Add any additional styles here
      />
    )}
                      </div>
                    </div>
                    {UserData ? (
                      <div className={style['usern']}>
                        {UserData.first_name}  {UserData.last_name} 
                          <div className={style['userp']}>{UserData.position_name}</div>
                      </div>
          
                    ) : (
                      <div></div>
                    )}
                  </div>
                  <li className={style['sidebar-title']}> </li>
                  <li >
                    <a onClick={dashboardPageHandleClick} className={style['material-icons']}>
                      <i className={styles['material-icons']}>
                        <DashboardOutlined/>
                      </i>
                      Dashboard
                    </a>
                  </li>
                  <li>
                    <a onClick={ProfilePageHandleClick} className={style['material-icons']}>
                      <i className={`${style['material-icons-outlined']} ${styles['material-icons']}`}>
                        <AccountCircleOutlined/>
                      </i>
                      Profile
                    </a>
                  </li>
                 
                  <li  className={style['active-page']}>
                    <a onClick={SeatplanPageHandleClick} className={style['material-icons']}>
                      <i className={`${style['material-icons-outlined']} ${styles['material-icons']}`}>
                        <ChairOutlined/>
                      </i>
                      Seat
                    </a>
                  </li>

                  
                  <li>
                  <a onClick={() => setShowLogoutConfirmation(true)} className={style['material-icons']}>
                    <i className={`${style['material-icons-outlined']} ${styles['material-icons']}`}>
                      <Logout/>
                    </i>
                    Logout
                  </a>
                </li>


                  {showLogoutConfirmation && (
        <div className={styles.popupModal}>
          <div className={styles.popupContent}>
            <p className={styles.popupText}>Are you sure you want to log out?</p>
            <button
              className={styles.popupButton}
              onClick={() => {
                handleLogout();
                setShowLogoutConfirmation(false);
              }}
            >
              Yes
            </button>
            <button
              className={styles.popupButton}
              onClick={() => setShowLogoutConfirmation(false)}
            >
              No
            </button>
          </div>
        </div>
      )}
                </ul>
              </div>
            </div>
          </div>
        </SwipeableDrawer>

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
        className={styles.canvas}
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
  {showInfoGuide && <div className={styles['backdrop-blur']}></div>}
  <div className={styles['uiverse']}>
  <button
        className={styles['handleInfoButtonClick']}
        onClick={handleInfoButtonClick}
        title="Click to open Info Guide"
      >
        <FaInfoCircle size={20} />
        <span className={styles['tooltip']}>Page Guide</span>
      </button>
      <>
      {showInfoGuide && (
        <div className={styles['infoguide']}>
          {/* Popup content */}
          <span className={styles['close']} onClick={handleInfoGuideClose}>
            &times;
          </span>
          <h2>Information Guide</h2>
          <p>This is a simple guide on how to use the page.</p><br />
          <p>• Use the middle mouse hold and drag to move around the canvas of the page.</p>
          <p>• To open and view the seats information, point the mouse on the seat number and double left click.</p>
          <p>• On Edit Mode, there are two things you can do, assigning an occupant to the current selected seat or swap the current user on another user on a different seat.</p>
          <p>• When swapping seats, you can select the seat to be swap on the current seat you are editing.</p>
        </div>
      )}

    </></div>
</div>


</div>

</body>

);
}

export default ViewerSeatPage;
