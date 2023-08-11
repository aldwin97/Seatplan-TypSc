import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './login_component/logInPage';
import ViewSeatPage from './viewseat_component/viewSeatPage';
import HelpPage from './help_component/helpPage';
import DashboardPage from './dashboard_component/dashboardPage';
import AdminMembersPage from './admin_component/adminMembersPage';
import SeatplanPage from './seatplan_component/seatplanPage';
import ProfilePage from './profile_component/profilePage';
import ProjectPage from './project_component/projectPage';
import MachinePage from './admin_component/machinetablePage';
import ProtectedRoute from './ProtectedRoute'; // Make sure the path is correct
import './App.css';
  
function App(): JSX.Element {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public route for login */}
          <Route path="/" element={<LoginPage />} />

          {/* Protected routes */}
          <ProtectedRoute
            path="/viewSeatPage"
            allowedUserTypes={[1, 2]}
            element={<ViewSeatPage />}
          />
          <ProtectedRoute
            path="/dashboardPage"
            allowedUserTypes={[1, 2]}
            element={<DashboardPage />}
          />
          <ProtectedRoute
            path="/helpPage"
            allowedUserTypes={[1, 2]}
            element={<HelpPage />}
          />
          <ProtectedRoute
            path="/projectPage"
            allowedUserTypes={[1, 2]}
            element={<ProjectPage />}
          />
          <ProtectedRoute
            path="/seatplanPage"
            allowedUserTypes={[1, 2]}
            element={<SeatplanPage />}
          />
          <ProtectedRoute
            path="/adminPage"
            allowedUserTypes={[1, 2]}
            element={<AdminMembersPage />}
          />
          <ProtectedRoute
            path="/profilePage"
            allowedUserTypes={[1, 2]}
            element={<ProfilePage />}
          />
          <ProtectedRoute
            path="/machinetablePage"
            allowedUserTypes={[1, 2]}
            element={<MachinePage />}
          />

          {/* Redirect to the homepage for unknown routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
