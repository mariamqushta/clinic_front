import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import SignupPage from "./Pages/SignupPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;