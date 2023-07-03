
import './viewSeatPage.css';
import { useNavigate } from 'react-router-dom';

const ViewSeatPage = () => {
  const navigate = useNavigate();

  const viewSeatPageHandleClick = () => {
    navigate('/logInPage');
  };

  return (
    <>
      <button className="sub" type="submit" onClick={viewSeatPageHandleClick}>
        SIGN IN
      </button>
      <body>
        <div className="container">
          <form>
            {/* Form content */}
          </form>
        </div>
      </body>
    </>
  );
};

export default ViewSeatPage;
