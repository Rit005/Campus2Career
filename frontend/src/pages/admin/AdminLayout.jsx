import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AdminProfileDropdown from "../../components/AdminProfileDropdown";

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
  { name: "Users", path: "/admin/users", icon: "👥" },
  { name: "Students", path: "/admin/students", icon: "🎓" },
  { name: "Recruiters", path: "/admin/recruiters", icon: "💼" },
  { name: "Analytics", path: "/admin/analytics", icon: "📈" },
  { name: "Skill Trends", path: "/admin/skills", icon: "🛠️" },
  { name: "Risk Students", path: "/admin/risk-students", icon: "⚠️" },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        <h1 
          onClick={() => setCollapsed(!collapsed)}
          className="text-xl font-bold text-indigo-600 flex items-center gap-2 cursor-pointer hover:text-indigo-700 transition-colors"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
         <span className={collapsed ? "hidden" : ""}>Campus2Career</span>
        <span className="text-white bg-indigo-600 px-2 py-1 rounded-md text-sm shadow">
    ADMIN </span>
</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <AdminProfileDropdown user={user} onLogout={handleLogout} />
        </div>
      </header>

      <aside
        className={`fixed left-0 top-16 bottom-0 bg-white shadow-lg z-40 transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? collapsed 
              ? "w-20" 
              : "w-64" 
            : "-translate-x-full lg:translate-x-0 lg:w-64"
        }`}
      >
        <nav className="p-4 space-y-1 overflow-hidden">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <span className={`font-medium whitespace-nowrap transition-all duration-300 ${
                collapsed ? "opacity-0 hidden lg:inline" : "opacity-100"
              }`}>{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main
        className={`pt-16 min-h-screen transition-all duration-300 ease-in-out ${
          sidebarOpen 
            ? collapsed 
              ? "lg:ml-20" 
              : "lg:ml-64" 
            : "lg:ml-64"
        }`}
      >
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

