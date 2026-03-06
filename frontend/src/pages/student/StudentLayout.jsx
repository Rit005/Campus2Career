import { Outlet } from "react-router-dom";
import StudentNavbar from "./StudentNavbar";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <StudentNavbar />

      <main className="w-full px-6 lg:px-10 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;