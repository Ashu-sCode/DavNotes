// App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./routes/PrivateRoute";
import Spinner from "./utils/Spinner"; // optional spinner component

// Public Pages (Lazy Loaded)
const HomePage = lazy(() => import("./pages/HomePage"));
const ProgramsPage = lazy(() => import("./pages/ProgramsPage"));
const SemestersPage = lazy(() => import("./pages/SemestersPage"));
const SubjectsPage = lazy(() => import("./pages/SubjectsPage"));
const ResourcesPage = lazy(() => import("./pages/ResourcesPage"));
const NotAuthorized = lazy(() => import("./pages/NotAuthorized"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

// Auth Pages
const LoginPage = lazy(() => import("./pages/LoginPage"));

// CMS / Admin Pages
const Dashboard = lazy(() => import("./cms/Dashboard"));
const UploadResource = lazy(() => import("./cms/UploadResource"));
const ManageResource = lazy(() => import("./cms/ManageResource"));
const ManageUsers = lazy(() => import("./cms/ManageUsers"));
const AdminProfile = lazy(() => import("./cms/AdminProfile"));

// Uploader Pages
const DashboardPage = lazy(() => import("./pages/uploader/DashboardPage"));
const MyUploads = lazy(() => import("./pages/uploader/MyUploads"));
const JoinAsUploader = lazy(() => import("./pages/JoinAsUploader"));
const JoinAsUploaderSuccess = lazy(() =>
  import("./pages/JoinAsUploaderSuccess")
);

// Layouts
const AdminLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    {/* Admin can have sidebar here if needed */}
    {children}
  </div>
);

const UploaderLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">{children}</div>
);

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Suspense
            fallback={
              <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
                <Spinner size={60} />
                <p className="mt-4 text-gray-700 dark:text-gray-300 text-lg animate-pulse">
                  Loading, please wait...
                </p>
              </div>
            }
          >
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

              {/* Join as Uploader */}
              <Route path="/join-as-uploader" element={<JoinAsUploader />} />
              <Route
                path="/join-as-uploader/success"
                element={<JoinAsUploaderSuccess />}
              />

              {/* Contact & About */}
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />

              {/* Auth Route */}
              <Route path="/admin/login" element={<LoginPage />} />

              {/* Not Authorized */}
              <Route path="/not-authorized" element={<NotAuthorized />} />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <PrivateRoute roles={["admin"]}>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="manage" element={<ManageResource />} />
                        <Route path="manage-users" element={<ManageUsers />} />
                        
                        <Route
                          path="*"
                          element={<Navigate to="/not-authorized" />}
                        />
                      </Routes>
                    </AdminLayout>
                  </PrivateRoute>
                }
              />

              {/* Admin Profile */}
              <Route
                path="/profile"
                element={
                  <PrivateRoute roles={["admin" , "uploader"]}>
                    <AdminLayout>
                      <AdminProfile />
                    </AdminLayout>
                  </PrivateRoute>
                }
              />
                  <Route
                path="/my-uploads"
                element={
                  <PrivateRoute roles={["admin" , "uploader"]}>
                    <AdminLayout>
                      <MyUploads />
                    </AdminLayout>
                  </PrivateRoute>
                }
              />

             
              {/* CMS Routes */}
              <Route
                path="/cms/*"
                element={
                  <PrivateRoute roles={["admin", "uploader"]}>
                    <AdminLayout>
                      <Routes>
                        <Route path="upload" element={<UploadResource />} />
                        <Route
                          path="*"
                          element={<Navigate to="/not-authorized" />}
                        />
                      </Routes>
                    </AdminLayout>
                  </PrivateRoute>
                }
              />

              {/* Uploader Routes */}
              <Route
                path="/uploader/*"
                element={
                  <PrivateRoute roles={["admin", "uploader"]}>
                    <UploaderLayout>
                      <Routes>
                        <Route path="dashboard" element={<DashboardPage />} />
                        
                        <Route
                          path="*"
                          element={<Navigate to="/not-authorized" />}
                        />
                      </Routes>
                    </UploaderLayout>
                  </PrivateRoute>
                }
              />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
