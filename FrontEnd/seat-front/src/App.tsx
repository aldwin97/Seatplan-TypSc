import LoginPage from './login component/logInPage';
import ViewSeatPage from './page/viewSeatPage';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <>
    <body>
    <div className="App">
      <header className="header"></header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/viewSeatPage" element={<ViewSeatPage />} />
        </Routes>
      </BrowserRouter>
      <footer className="footer">All Rights Reserved 2023</footer>
    </div>
    </body>
    </>
  );
}

export default App;
