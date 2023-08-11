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

function ProtectedRoute({
  allowedUserTypes,
  element: Element,
}: {
  allowedUserTypes: number[];
  element: React.ElementType;
}) {
  const usertypeId = Number(window.sessionStorage.getItem('usertype_id'));

  if (!usertypeId || !allowedUserTypes.includes(usertypeId)) {
    return <Navigate to="/DashboardPage" />;
  }

  return <Element />;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/viewSeatPage" element={<ViewSeatPage />} />
          <Route
            path="/dashboardPage"
            element={<ProtectedRoute allowedUserTypes={[1, 2, 3]} element={DashboardPage} />}
          />
          {/* Repeat for other protected routes */}
          <Route path="/helpPage" element={<HelpPage />} />
          <Route
            path="/projectPage"
            element={<ProtectedRoute allowedUserTypes={[3, 2]} element={ProjectPage} />}
          />
          <Route
            path="/seatplanPage"
            element={<ProtectedRoute allowedUserTypes={[3, 2]} element={SeatplanPage} />}
          />
          <Route
            path="/adminPage"
            element={<ProtectedRoute allowedUserTypes={[3, 2]} element={AdminMembersPage} />}
          />
          <Route
            path="/profilePage"
            element={<ProtectedRoute allowedUserTypes={[1, 2, 3]} element={ProfilePage} />}
          />
          <Route
            path="/machinetablePage"
            element={<ProtectedRoute allowedUserTypes={[3, 2]} element={MachinePage} />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
