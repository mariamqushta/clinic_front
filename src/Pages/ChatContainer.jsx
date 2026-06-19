import { Navigate } from "react-router-dom";
import Chat1PagePatient from "./Chat1PagePatient";
import Chat1PageDoctor from "./Chat1PageDoctor";

export default function ChatContainer() {
  const role = localStorage.getItem("role");

  if (role === "patient") {
    return <Chat1PagePatient />;
  } else if (role === "doctor") {
    return <Chat1PageDoctor />;
  }

  return <Navigate to="/select" replace />;
}
