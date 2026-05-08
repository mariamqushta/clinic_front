import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Book1 from "./Pages/Bookdoctor";
import Appointments from "./Pages/Appointments";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import LoginPageDr from "./pages/LoginPageDr";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import DoctorSignupPage from "./Pages/DoctorSignupPage";
import UnderReviewPage from "./Pages/UnderReviewPage";
import RequestAcceptedPage from "./Pages/RequestAcceptedPage";
import RequestRejectedPage from "./Pages/RequestRejectedPage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<Book1 />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/LoginDr" element={<LoginPageDr />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/doctor-signup" element={<DoctorSignupPage />} />
        <Route path="/under-review" element={<UnderReviewPage />} />
        <Route path="/request-accepted" element={<RequestAcceptedPage />} />
        <Route path="/request-rejected" element={<RequestRejectedPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;