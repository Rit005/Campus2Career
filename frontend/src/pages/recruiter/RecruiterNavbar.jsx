import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Gift, MoreVertical } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const RecruiterNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef(null);

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "R";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMobileOpen(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && menuRef.current && !menuRef.current.contains(e.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50 border-b">
      <div className="w-full px-6 lg:px-10">
        <div className="h-20 flex items-center justify-between">

          <div className="flex flex-col leading-tight">
            <span className="text-xl lg:text-2xl font-extrabold text-primary-600">
              Campus2Career
            </span>
            <span className="mt-1 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold w-fit">
              Recruiter
            </span>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-8">
            <NavItem to="/recruiter/dashboard" label="📊 Dashboard" end />
            <NavItem to="/recruiter/matching" label="🤝 Post Jobs" />
            <NavItem to="/recruiter/analytics" label="📈 Analytics" />
            <NavItem to="/recruiter/applicants" label="👨‍🎓 Applicants" />
            <NavItem to="/recruiter/hr-assistant" label="🤖 HR Assistant" />
          </div>

          <div className="hidden lg:flex items-center gap-6">

            <button
              onClick={() => navigate("/choose-dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              <Gift size={18} />
              Switch Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="lg:hidden">
            <button onClick={() => setMobileOpen(!mobileOpen)}>
              <MoreVertical size={26} />
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div
          ref={menuRef}
          className="lg:hidden fixed top-20 right-4 w-72 bg-white rounded-xl shadow-xl border z-50 p-5 space-y-5"
        >
          <MobileNavItem to="/recruiter/dashboard" label="📊 Dashboard" close={closeMenu} />
          <MobileNavItem to="/recruiter/matching" label="🤝 Post Jobs" close={closeMenu} />
          <MobileNavItem to="/recruiter/analytics" label="📈 Analytics" close={closeMenu} />
          <MobileNavItem to="/recruiter/applicants" label="👨‍🎓 Applicants" close={closeMenu} />
          <MobileNavItem to="/recruiter/hr-assistant" label="🤖 HR Assistant" close={closeMenu} />

          <hr />

          <button
            onClick={() => {
              closeMenu();
              navigate("/choose-dashboard");
            }}
            className="flex items-center gap-2 w-full text-left text-blue-600 font-semibold"
          >
            <Gift size={18} />
            Switch Dashboard
          </button>

          <button
            onClick={() => {
              closeMenu();
              handleLogout();
            }}
            className="w-full text-left text-red-600 font-semibold"
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  );
};

const NavItem = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `text-base font-semibold pb-1 transition ${
        isActive
          ? "text-primary-700 border-b-2 border-primary-500"
          : "text-gray-500 hover:text-gray-700"
      }`
    }
  >
    {label}
  </NavLink>
);

const MobileNavItem = ({ to, label, close }) => (
  <NavLink
    to={to}
    onClick={close}
    className="block text-gray-700 hover:text-blue-600 font-medium"
  >
    {label}
  </NavLink>
);

export default RecruiterNavbar;