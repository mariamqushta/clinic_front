import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function OAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const hasRun = useRef(false);

  useEffect(() => {
    // Extract token from query params
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const intendedRole = queryParams.get("intendedRole");

    const verifyUser = async (token) => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        const res = await fetch("http://localhost:3000/api/v1/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        const role = data?.data?.user?.role;

        if (intendedRole === "doctor" && role !== "doctor") {
          toast.error("Invalid email or password");
          localStorage.removeItem("token");
          navigate("/LoginDr");
          return;
        }

        if (intendedRole === "patient" && role !== "patient") {
          toast.error("Invalid email or password");
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }
        
        localStorage.setItem("role", role);
        localStorage.setItem("user", JSON.stringify(data?.data?.user));
        
        toast.success("Login successful with Google!");
        
        if (role === "doctor") {
          localStorage.setItem("doctorId", data?.data?.user?._id);
          navigate("/doctor/appointments");
        } else {
          navigate("/home");
        }
      } catch (err) {
        console.log("Failed to fetch profile", err);
        toast.error("Google authentication failed to fetch profile.");
        navigate("/login");
      }
    };

    if (token) {
      localStorage.setItem("token", token);
      verifyUser(token);
    } else {
      toast.error("Google authentication failed.");
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <h2>Authenticating...</h2>
    </div>
  );
}
