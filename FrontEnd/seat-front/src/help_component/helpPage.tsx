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
          <div className={styles.img}>OUR SUPPORT CENTER<div className={styles.searchBar}>
          <input type="text" placeholder="Have a question? Search here!" className={styles.searchInput} />
          <button className={styles.searchButton} type="submit">
            <FaSearch />
          </button>
        </div></div>
          
          <button className={styles.sub} type="submit" onClick={helpPageHandleClick}>
            SIGN IN
          </button> 
          <div className={styles.scrollable}>
          <div className={styles.text1}>FREQUENTLY ASKED QUESTIONS</div>
          <div className={styles.text2}>General Questions</div>
          <div className={styles.text3}>• How do I delete My Account?</div>
          <form className={styles.form1}></form>
          <div className={styles.text3}>• How can I update my seat?</div>
          <form className={styles.form1}></form>
          <div className={styles.text3}>• How can I recover my Account?</div>
          <form className={styles.form1}></form>
          </div>
        </form>
      </div>
    </>
  );
};

export default HelpPage