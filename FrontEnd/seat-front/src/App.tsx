import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './login_component/logInPage';
import ViewSeatPage from './viewseat_component/viewSeatPage';
import HelpPage from './help_component/helpPage';
import DashboardPage from './dashboard_component/dashboardPage';
import AdminMembersPage from './admin_component/adminMembersPage';
import SeatplanPage from './seatplan_component/seatplanPage';
import ProfilePage from './profile_component/profilePage';
import ProjectPage from './project_component/projectPage';
import MachinePage from './admin_component/machinetablePage';

import './App.css';

function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/viewSeatPage" element={<ViewSeatPage />} />
          <Route path="/dashboardPage" element={<DashboardPage />} />
          <Route path="/helpPage" element={<HelpPage />} />
          <Route path="/projectPage" element={<ProjectPage />} />
          <Route path="/seatplanPage" element={<SeatplanPage />} />
          <Route path="/adminPage" element={<AdminMembersPage />} />
          <Route path="/profilePage" element={<ProfilePage />} />
          <Route path="/machinetablePage" element={<MachinePage />} />
          <Route path="*" element={<Navigate to="/" />} /> {/* Redirect to the homepage for unknown routes */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
