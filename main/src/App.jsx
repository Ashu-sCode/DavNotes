import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Public pages
import HomePage from "./pages/HomePage";
import ProgramsPage from "./pages/ProgramsPage";
import SemestersPage from "./pages/SemestersPage";
import SubjectsPage from "./pages/SubjectsPage";
import ResourcesPage from "./pages/ResourcesPage";
import NotAuthorized from "./pages/NotAuthorized";
import NotFoundPage from "./pages/NotFoundPage"; // <-- Create this component

// Auth pages
import LoginPage from "./pages/LoginPage";

// CMS / Admin pages
import Dashboard from "./cms/Dashboard";
import UploadResource from "./cms/UploadResource";
import ManageResource from "./cms/ManageResource";
import ManageUsers from "./cms/ManageUsers";
import AdminProfile from "./cms/AdminProfile";

// Uploader pages
import DashboardPage from "./pages/uploader/DashboardPage";

// Route protection
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/programs" element={<ProgramsPage />} />
            <Route path="/program/:programName" element={<SemestersPage />} />
            <Route
              path="/programs/:programName/semesters/:semester/subjects"
              element={<SubjectsPage />}
            />
            <Route
              path="/programs/:programName/semesters/:semester/subjects/:subject/resources"
              element={<ResourcesPage />}
            />
            <Route path="/not-authorized" element={<NotAuthorized />} />

            {/* Auth Route */}
            <Route path="/admin/login" element={<LoginPage />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roles={["admin"]}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <PrivateRoute roles={["admin", "uploader"]}>
                  <UploadResource />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ManageResource />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage-users"
              element={
                <PrivateRoute roles={["admin"]}>
                  <ManageUsers />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <PrivateRoute roles={["admin", "uploader"]}>
                  <AdminProfile />
                </PrivateRoute>
              }
            />

            {/* Uploader Routes */}
            <Route
              path="/uploader/dashboard"
              element={
                <PrivateRoute roles={["admin", "uploader"]}>
                  <DashboardPage />
                </PrivateRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
