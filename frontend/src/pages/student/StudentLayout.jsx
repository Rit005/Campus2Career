import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Reusable Navbar */}
      <StudentNavbar />

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>

    </div>
  );
};

export default StudentLayout;
