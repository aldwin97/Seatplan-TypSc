import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './viewSeatPage.module.css';

const ViewSeatPage = () => {
  const navigate = useNavigate();

  const viewSeatPageHandleClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className={styles.container2}>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search" className={styles.searchInput} />
          <button className={styles.searchButton} type="submit">
            <FaSearch />
          </button>
        </div>
        <form className={styles.form2}>
          {/* Form content */}
          
          <button className={styles.sub} type="submit" onClick={viewSeatPageHandleClick}>
            SIGN IN
          </button>
        </form>
      </div>
    </>
  );
};

export default ViewSeatPage;
