import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './dashboardPage.module.css';

function dashboardPage() {
  return (
    <>
    <div className={styles.header}>
        <button className={styles.dashboardButton}>
            <span className={styles.icon}></span>
            Dashboard
        </button>
        <button className={styles.membersButton}>
            <span className={styles.icon}></span>
            Members
        </button>
        <button className={styles.projectsButton}>
            <span className={styles.icon}></span>
            Projects
        </button>
        <span className={styles.notificationIcon}></span>
        <span className={styles.profileIcon}></span>
    </div>
    <div className={styles.container2}>
      <form className={styles.form2}>
      <div className={styles.card}>
        <svg className={styles.cardimg}></svg>
            <div className={styles.cardtitle}>HELLO (USERNAME)</div>
        </div>
      </form>
    </div>
  </>
  )
}

export default dashboardPage