import { Link, useLocation, useNavigate } from "react-router-dom";

const navItems = [
  { path: "/dashboard",  label: "Dashboard",  icon: "📊" },
  { path: "/members",    label: "Members",    icon: "👥" },
  { path: "/attendance", label: "Attendance", icon: "✅" },
  { path: "/payments",   label: "Payments",   icon: "💳" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🏋️</div>
        <span className="sidebar-logo-text">PowerFit</span>
      </div>

      {/* Navigation */}
      <p className="sidebar-section-title">Menu</p>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="sidebar-logout">
        <button className="sidebar-link" onClick={handleLogout} style={{ color: "#ef4444" }}>
          <span className="link-icon">🚪</span>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;