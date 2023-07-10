import React, { useState, useEffect } from 'react';
import LoginPage from './login_component/logInPage';
import ViewSeatPage from './viewseat_component/viewSeatPage';
import HelpPage from './help_component/helpPage';
import DashboardPage from './dashboard_component/dashboardPage';
import AdminMembersPage from './admin_component/adminMembersPage';
import SeatplanPage from './seatplan_component/seatplanPage'
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

function App(): JSX.Element {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/viewSeatPage" element={<ViewSeatPage />} />
          <Route path="/dashboardPage" element={<DashboardPage />} />
          <Route path="/helpPage" element={<HelpPage />} />
          <Route path="/seatPlanPage" element={<SeatplanPage />} />
          <Route path="/adminPage" element={<AdminMembersPage />} />
          <Route path="*" element={<Navigate to="/" />} /> // Redirect to the homepage for unknown routes
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
