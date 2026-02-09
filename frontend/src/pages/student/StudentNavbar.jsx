import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { LogOut, Gift } from "lucide-react";

const StudentNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="w-full px-10">
        <div className="h-20 flex items-center">

          {/* LEFT */}
          <div className="flex items-center gap-4 mr-10">
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-primary-600">
                Campus2Career
              </span>
              <span className="mt-1 px-4 py-1 rounded-full bg-green-500 text-white text-xs font-semibold w-fit">
                Student
              </span>
            </div>
          </div>

          {/* CENTER NAV */}
          <div className="flex items-center gap-6 flex-1">
            <NavItem to="/student/dashboard" label="📊Dashboard" end />
            <NavItem to="/student/marksheet-upload" label="📤 Upload Marksheet" />
            <NavItem to="/student/resume-analyzer" label="📄 Resume Analyzer" />
            <NavItem to="/student/career-guidance" label="🎯 Career Guidance" />
            <NavItem to="/student/ai-mentor" label="🤖 AI Mentor" />
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate("/choose-dashboard")}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              <Gift size={18} />
              Switch Dashboard
            </button>

            {/* Avatar */}
            <div className="relative group">
              <div className="w-10 h-10 rounded-full bg-primary-600 text-white
                              flex items-center justify-center font-bold cursor-pointer">
                {initials}
              </div>

              <div
                className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border
                           opacity-0 invisible group-hover:opacity-100 group-hover:visible
                           transition-all duration-200 z-50"
              >
                <div className="px-4 py-3 border-b">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>

                <button
                  onClick={() => navigate("/student/profile")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                >
                  View Profile
                </button>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </div>
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
          ? "text-primary-900 border-b-2 border-primary-500"
          : "text-gray-500 hover:text-gray-700"
      }`
    }
  >
    {label}
  </NavLink>
);

export default StudentNavbar;
