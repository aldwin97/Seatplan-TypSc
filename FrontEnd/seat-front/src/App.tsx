import LoginPage from './login_component/logInPage';
import ViewSeatPage from './viewseat_component/viewSeatPage';
import HelpPage from './help_component/helpPage';
import DashboardPage from './dashboard_component/dashboardPage';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <>
    <body>
    <div className="App">
      <header className="header">
      <div className="banter-loader">
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          <div className="banter-loader__box"></div>
          </div>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/viewSeatPage" element={<ViewSeatPage />} />
          <Route path="/dashboardPage" element={<DashboardPage />} />
          <Route path="/helpPage" element={<HelpPage />} />
        </Routes>
      </BrowserRouter>
      <footer className="footer">All Rights Reserved 2023</footer>
    </div>
    </body>
    </>
  );
}

export default App;
