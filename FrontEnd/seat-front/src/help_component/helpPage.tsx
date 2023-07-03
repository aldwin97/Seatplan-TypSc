import { useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './helpPage.module.css';

const HelpPage = () => {
  const navigate = useNavigate();

  const helpPageHandleClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className={styles.container2}>
        <form className={styles.form2}>
          {/* Form content */}
          <div className={styles.img}>Our Support Center</div>
          <button className={styles.sub} type="submit" onClick={helpPageHandleClick}>
            SIGN IN
          </button>
        </form>
      </div>
    </>
  );
};

export default HelpPage