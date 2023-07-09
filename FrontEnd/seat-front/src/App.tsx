import LoginPage from './login_component/logInPage';
import ViewSeatPage from './viewseat_component/viewSeatPage';
import HelpPage from './help_component/helpPage';
import DashboardPage from './dashboard_component/dashboardPage';
import AdminMembersPage from './admin_component/adminMembersPage';
import ViewInformationPage from './admin_component/viewInformationPage';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App(): JSX.Element {
  return (
    <>
    <body>
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/viewSeatPage" element={<ViewSeatPage />} />
          <Route path="/dashboardPage" element={<DashboardPage />} />
          <Route path="/viewInformationPage" element={<ViewInformationPage />} />
          <Route path="/helpPage" element={<HelpPage />} />
          <Route path="/adminPage" element={<AdminMembersPage />} />
        </Routes>
      </BrowserRouter>
    </div>
    </body>
    </>
  );
}

export default App;
