import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import adminAPI from "../../api/admin";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

export default function SkillTrends() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSkillTrends();
      if (res.data.success) {
        setSkills(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch skill trends");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 bg-gray-200 rounded-xl animate-pulse"></div>
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
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Skill Trends</h2>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Top 10 Skills from Resumes</h3>
        
        {skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No skills data available yet
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={skills} layout="vertical" margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="skill" width={100} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="count" name="Count" radius={[0, 4, 4, 0]}>
                {skills.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">Detailed View</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Skill</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {skills.map((skill, index) => (
              <tr key={skill.skill} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-900">#{index + 1}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {skill.skill}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{skill.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

