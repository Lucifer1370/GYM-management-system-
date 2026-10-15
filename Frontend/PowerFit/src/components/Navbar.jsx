import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard":  "Dashboard",
  "/members":    "Members",
  "/attendance": "Attendance",
  "/payments":   "Payments",
};

function Navbar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const title = pageTitles[location.pathname] || "PowerFit";
  const initials = (user?.name || "A").split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="navbar">
      <h2 className="navbar-title">{title}</h2>
      <div className="navbar-user">
        <div className="navbar-avatar">{initials}</div>
        <span className="navbar-username">{user?.name || "Admin"}</span>
      </div>
    </div>
  );
}

export default Navbar;