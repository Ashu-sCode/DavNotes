import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Pyq from "./pages/Pyq";
import LoginPage from "./pages/LoginPage";

import Dashboard from "./cms/Dashboard";
import UploadResource from "./cms/UploadResource";
// import ManageUploads from "./cms/ManageUploads";
import PrivateRoute from "./routes/PrivateRoute";
import ManageResources from "./cms/ManageResource";

import ProfilePage from "./cms/AdminProfile";
import HomePage from "./pages/HomePage";
import ProgramsPage from "./pages/ProgramsPage";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* pages Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/notes" element={<ProgramsPage />} />
            <Route path="/pyq" element={<Pyq />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/upload"
              element={
                <PrivateRoute>
                  <UploadResource />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/manage"
              element={
                <PrivateRoute>
                  <ManageResources />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/login"
              element={
                <PrivateRoute>
                  <LoginPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/profile"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
