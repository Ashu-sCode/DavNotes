import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Assignments from "./pages/Assignments";
import LoginPage from "./pages/LoginPage";

import Dashboard from "./cms/Dashboard";
import UploadResource from "./cms/UploadResource";
// import ManageUploads from "./cms/ManageUploads";
import PrivateRoute from "./routes/PrivateRoute";
import ManageResources from "./cms/ManageResource";

import ProfilePage from "./cms/AdminProfile";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            {/* pages Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="/assignments" element={<Assignments />} />

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="/admin/upload" element={<PrivateRoute><UploadResource /></PrivateRoute>} />
            <Route path="/admin/manage" element={<PrivateRoute><ManageResources /></PrivateRoute>} />
            <Route path="/admin/login" element={<PrivateRoute><LoginPage /></PrivateRoute>} />
            <Route path="/admin/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;