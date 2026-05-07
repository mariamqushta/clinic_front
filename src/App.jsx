import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./Pages/Home";
import Book1 from "./Pages/Bookdoctor";
import Appointments from "./Pages/Appointments";
import SignupPage from "./Pages/SignupPage";
import LoginPage from "./Pages/LoginPage";
import LoginPageDr from "./pages/LoginPageDr";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<Book1 />} />
        <Route path="/Appointments" element={<Appointments />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/LoginDr" element={<LoginPageDr />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;