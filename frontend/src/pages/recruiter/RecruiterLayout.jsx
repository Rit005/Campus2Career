import { Outlet } from "react-router-dom";
import RecruiterNavbar from "./RecruiterNavbar";

const RecruiterLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <RecruiterNavbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
};

export default RecruiterLayout;
