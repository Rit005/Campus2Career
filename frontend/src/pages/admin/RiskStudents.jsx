// frontend/src/pages/admin/RiskStudents.jsx
import { useState, useEffect } from "react";
import adminAPI from "../../api/admin";

export default function RiskStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAtRiskStudents();
  }, []);

  const fetchAtRiskStudents = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getAtRiskStudents();
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch at-risk students");
    } finally {
      setLoading(false);
    }
  };

  const getRiskBadge = (reason) => {
    if (reason.includes('Low CGPA')) {
      return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Low CGPA</span>;
    }
    if (reason.includes('No marksheets')) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">No Marksheets</span>;
    }
    return <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">Multiple</span>;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">At-Risk Students</h2>
          <p className="text-gray-500 mt-1">Students with low CGPA or no marksheets uploaded</p>
        </div>
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium">
          {students.length} At-Risk
        </div>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-xl font-semibold text-gray-800">No At-Risk Students</h3>
          <p className="text-gray-500 mt-2">All students are doing well!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">CGPA</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase">Risk Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`font-medium ${
                      student.cgpa === 'N/A' ? 'text-gray-400' : 
                      parseFloat(student.cgpa) < 6.0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {student.cgpa}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRiskBadge(student.riskReason)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

