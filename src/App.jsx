import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Book1 from "./Pages/Bookdoctor";
import Appointments from "./Pages/Appointments";
import AppointmentsDr from "./Pages/AppointmentsDr";
import Profile from "./Pages/Profile";
import DrProfile from "./Pages/Drprofile";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import LoginPageDr from "./pages/LoginPageDr";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import DoctorSignupPage from "./Pages/DoctorSignupPage";
import UnderReviewPage from "./Pages/UnderReviewPage";
import RequestAcceptedPage from "./Pages/RequestAcceptedPage";
import RequestRejectedPage from "./Pages/RequestRejectedPage";
import SelectRole from "./Pages/SelectRole";
import Chat1PagePatient from "./Pages/Chat1PagePatient";
import Chat1PageDoctor from "./Pages/Chat1PageDoctor";

// 🔐 get role helper
const getRole = () => localStorage.getItem("role");

// 🔒 guards
const PatientRoute = ({ children }) => {
  const role = getRole();
  if (role !== "patient") return <Navigate to="/select" replace />;
  return children;
};

const DoctorRoute = ({ children }) => {
  const role = getRole();
  if (role !== "doctor") return <Navigate to="/select" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👉 first screen */}
        <Route path="/" element={<Navigate to="/select" replace />} />
        <Route path="/select" element={<SelectRole />} />

        {/* 👉 auth pages (both can access) */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/LoginDr" element={<LoginPageDr />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/doctor-signup" element={<DoctorSignupPage />} />
        <Route path="/under-review" element={<UnderReviewPage />} />
        <Route path="/request-accepted" element={<RequestAcceptedPage />} />
        <Route path="/request-rejected" element={<RequestRejectedPage />} />
        <Route path="/chat1-patient" element={<Chat1PagePatient />} />
        <Route path="/doctor-chat-1" element={<Chat1PageDoctor />} />

        {/* 👤 PATIENT ROUTES */}
        <Route
          path="/home"
          element={
            <PatientRoute>
              <Home />
            </PatientRoute>
          }
        />

        <Route
          path="/book/:id"
          element={
            <PatientRoute>
              <Book1 />
            </PatientRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <PatientRoute>
              <Appointments />
            </PatientRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PatientRoute>
              <Profile />
            </PatientRoute>
          }
        />

        {/* 👨‍⚕️ DOCTOR ROUTES */}
        <Route
          path="/doctor/appointments"
          element={
            <DoctorRoute>
              <AppointmentsDr />
            </DoctorRoute>
          }
        />

        <Route
          path="/doctor/profile"
          element={
            <DoctorRoute>
              <DrProfile />
            </DoctorRoute>
          }
        />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/select" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;