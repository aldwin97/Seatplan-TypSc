import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './dashboardPage.module.css';

function dashboardPage() {
  return (
    <>
        <button className={styles.sub}>📊Dashboard</button>
        <button className={styles.sub1}>👥Members</button>
        <button className={styles.sub2}>📔Projects</button>
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