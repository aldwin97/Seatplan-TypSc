import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './dashboardPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBell, faChartBar, faUsers, faProjectDiagram, faPowerOff, faFaceSmile } from '@fortawesome/free-solid-svg-icons';

function DashboardPage() {
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
  const [currDate, setCurrDate] = useState('');
  const [currTime, setCurrTime] = useState('');

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  useEffect(() => {
    const timerID = setInterval(() => {
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString();
      const formattedTime = currentDate.toLocaleTimeString();
      setCurrDate(formattedDate);
      setCurrTime(formattedTime);
    }, 1000);

    return () => {
      clearInterval(timerID);
    };
  }, []);

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

      <button className={styles.notif}>
        <FontAwesomeIcon icon={faBell} />
      </button>


      <div className={styles.container2}>
        <form className={styles.form2}>
          <div className={styles.card}>
            <svg className={styles.cardimg}></svg>
            <div className={styles.cardtitle}>HELLO (USERNAME)</div>
            <div className={styles.cardtext}>Welcome Back! Always check you Notifications!</div>
            <div className={styles.date}>Today is {currDate}</div>
            <div className={styles.time}>{currTime}</div>
          </div>

          <div className={styles.card2}>
            <svg className={styles.cardimg2}></svg>
            <div className={styles.cardtitle2}>TOTAL SEAT</div>
          </div>

          <div className={styles.card3}>
            <svg className={styles.cardimg3}></svg>
            <div className={styles.cardtitle3}>OCCUPIED SEAT</div>
          </div>

          <div className={styles.card4}>
            <svg className={styles.cardimg4}></svg>
            <div className={styles.cardtitle4}>AVAILABLE SEAT</div>
          </div>

          <div className={styles.card5}>
            <svg className={styles.cardimg5}></svg>
            <div className={styles.cardtitle5}>SEAT CONDITIONS</div>
          </div>

          <div className={styles.card6}>
            <svg className={styles.cardimg6}></svg>
            <div className={styles.cardtitle6}>TOTAL EMPLOYEE</div>
          </div>

          <div className={styles.card7}>
            <svg className={styles.cardimg7}></svg>
            <div className={styles.cardtitle7}>TRAINEE</div>
          </div>

          <div className={styles.card8}>
            <svg className={styles.cardimg8}></svg>
            <div className={styles.cardtitle8}>REGULAR EMPLOYEE</div>
          </div>

          <div className={styles.scrollable}>
          <div className={styles.card9}>
            <svg className={styles.cardimg9}></svg>
            <div className={styles.cardtitle9}>RECENT COMMENTS</div>
          </div></div>

          <div className={styles.scrollable2}>
          <div className={styles.card0}>
            <svg className={styles.cardimg0}></svg>
            <div className={styles.cardtitle0}>RECENT ACTIVITIES</div>
          </div></div>

        </form>
      </div>
    </div>
  );
}

export default DashboardPage;
