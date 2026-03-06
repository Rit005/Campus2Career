import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Gift, MoreVertical } from "lucide-react";
import { useState, useEffect, useRef } from "react";

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const initials =
    user?.name
      ?.split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
     <div className="w-full px-6 lg:px-10">
        <div className="h-20 flex items-center justify-between">

          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-extrabold text-primary-600">
              Campus2Career
            </span>
            <span className="mt-1 px-3 py-0.5 rounded-full bg-green-500 text-white text-xs font-semibold w-fit">
              Student
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            <NavItem to="/student/dashboard" label="📊 Dashboard" end />
            <NavItem to="/student/marksheet-upload" label="📤 Upload Marksheet" />
            <NavItem to="/student/resume-analyzer" label="📄 Resume Analyzer" />
            <NavItem to="/student/career-guidance" label="🎯 Career Guidance" />
            <NavItem to="/student/ai-mentor" label="🤖 AI Mentor" />
          </div>

          <div className="hidden lg:flex items-center gap-8">

            <button
              onClick={() => navigate("/choose-dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold text-base transition"
            >
              <Gift size={20} />
              Switch Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-semibold text-base transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>

          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <MoreVertical size={26} />
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="lg:hidden fixed top-16 right-4 w-72 bg-white rounded-xl shadow-xl border z-50 p-5 space-y-5"
        >
          <MobileNavItem to="/student/dashboard" label="📊 Dashboard" close={closeMenu} />
          <MobileNavItem to="/student/marksheet-upload" label="📤 Upload Marksheet" close={closeMenu} />
          <MobileNavItem to="/student/resume-analyzer" label="📄 Resume Analyzer" close={closeMenu} />
          <MobileNavItem to="/student/career-guidance" label="🎯 Career Guidance" close={closeMenu} />
          <MobileNavItem to="/student/ai-mentor" label="🤖 AI Mentor" close={closeMenu} />

          <hr />

          <MobileNavItem to="/student/profile" label="👤 Profile" close={closeMenu} />
          <MobileNavItem to="/student/my-applications" label="📂 My Applications" close={closeMenu} />

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

 {/* DESKTOP NAV ITEM */}
const NavItem = ({ to, label, end = false }) => (
  <NavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `text-s font-semibold pb-1 transition ${
        isActive
          ? "text-primary-900 border-b-2 border-primary-500"
          : "text-gray-600 hover:text-gray-900"
      }`
    }
  >
    {label}
  </NavLink>
);

{/* MOBILE NAV ITEM */}
const MobileNavItem = ({ to, label, close }) => (
  <NavLink
    to={to}
    onClick={close}
    className="block text-base text-gray-700 hover:text-blue-600 font-medium"
  >
    {label}
  </NavLink>
);

export default StudentNavbar;