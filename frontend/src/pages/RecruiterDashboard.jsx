import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Briefcase,
  Users,
  Calendar,
  Building,
  LogOut,
  UserCircle,
} from 'lucide-react';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* Top Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-16">

          {/* Logo */}
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primary-600">Campus2Career</h1>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              Recruiter
            </span>
          </div>

          {/* Right User Area */}
          <div className="flex items-center space-x-4">

            {/* Switch Dashboard Button */}
            <button
              onClick={() => navigate('/choose-dashboard')}
              className="flex items-center text-blue-600 hover:text-blue-800 transition"
            >
              <Briefcase size={18} className="mr-1" />
              Switch Dashboard
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <UserCircle className="text-primary-600 w-8 h-8" />
              <span className="text-gray-700 font-medium">
                {user?.name}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center text-red-600 hover:text-red-800 transition"
            >
              <LogOut size={18} className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-10">

        {/* Page Heading */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-900">
            Recruiter Dashboard
          </h2>
          <p className="text-gray-500 mt-1">
            Welcome back, {user?.name}! Here is your activity overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">

          <DashboardCard
            title="Active Jobs"
            value="8"
            icon={<Briefcase className="w-6 h-6 text-blue-600" />}
            iconBg="bg-blue-100"
          />

          <DashboardCard
            title="Total Applicants"
            value="156"
            icon={<Users className="w-6 h-6 text-green-600" />}
            iconBg="bg-green-100"
          />

          <DashboardCard
            title="Interviews"
            value="12"
            icon={<Calendar className="w-6 h-6 text-purple-600" />}
            iconBg="bg-purple-100"
          />

          <DashboardCard
            title="My Company"
            value="3"
            icon={<Building className="w-6 h-6 text-yellow-600" />}
            iconBg="bg-yellow-100"
          />

        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <nav className="flex border-b text-sm font-medium">
            {['overview', 'jobs', 'candidates', 'company'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-primary-600 text-primary-600 font-semibold'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="p-6">
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'jobs' && <JobsTab />}
            {activeTab === 'candidates' && <CandidatesTab />}
            {activeTab === 'company' && <CompanyTab />}
          </div>
        </div>
      </main>
    </div>
  );
};

/* ------------------ Reusable Components ------------------ */

const DashboardCard = ({ title, value, icon, iconBg }) => (
  <div className="bg-white rounded-xl p-6 shadow-md flex items-center space-x-4 hover:shadow-lg transition">
    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const OverviewTab = () => (
  <div>
    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

    <div className="space-y-4">

      <ActivityCard
        title="New Application Received"
        subtitle="Software Engineer - John Doe applied"
        icon={<Briefcase className="w-5 h-5 text-blue-600" />}
        bg="bg-blue-50"
      />

      <ActivityCard
        title="Interview Completed"
        subtitle="Jane Smith - Frontend Developer"
        icon={<Calendar className="w-5 h-5 text-green-600" />}
        bg="bg-green-50"
      />

    </div>
  </div>
);

const ActivityCard = ({ title, subtitle, icon, bg }) => (
  <div className={`flex items-center p-4 rounded-lg ${bg}`}>
    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow">
      {icon}
    </div>
    <div className="ml-4">
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  </div>
);

const JobsTab = () => (
  <EmptyState
    title="No active jobs"
    description="Post a new job opening to start receiving applications."
    buttonText="Post New Job"
  />
);

const CandidatesTab = () => (
  <EmptyState
    title="No candidates yet"
    description="Candidates will appear here when they apply to your jobs."
  />
);

const CompanyTab = () => (
  <EmptyState
    title="Company profile missing"
    description="Create your company profile to attract more candidates."
    buttonText="Create Company Profile"
  />
);

const EmptyState = ({ title, description, buttonText }) => (
  <div className="text-center py-16">
    <p className="text-xl font-medium text-gray-900">{title}</p>
    <p className="text-gray-500 mt-2">{description}</p>
    {buttonText && (
      <button className="mt-4 px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow">
        {buttonText}
      </button>
    )}
  </div>
);

export default RecruiterDashboard;
