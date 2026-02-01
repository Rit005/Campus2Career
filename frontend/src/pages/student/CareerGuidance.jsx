import { useState, useEffect } from 'react';
import { studentAPI } from '../../api/student';

const CareerGuidance = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadCareerProfile();
  }, []);

  const loadCareerProfile = async () => {
    try {
      const res = await studentAPI.getCareerProfile();
      if (res.data.success) setProfile(res.data.data);
    } catch (err) {
      console.error('Failed to load career profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await studentAPI.analyzeCareer();
      if (res.data.success) {
        setProfile(res.data.data);
      }
    } catch (err) {
      console.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Career Guidance</h2>
        <button
          onClick={handleAnalyze}
          disabled={analyzing}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {analyzing ? 'Analyzing...' : 'Analyze My Career'}
        </button>
      </div>

      {!profile ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">No Career Analysis Yet</h3>
          <p className="text-gray-500 mb-4">Upload your marksheets and click "Analyze My Career" to get personalized career guidance.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Career Domains */}
          {profile.careerDomains?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">🎯 Recommended Career Domains</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.careerDomains.map((domain, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{domain.name}</span>
                      <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{domain.matchScore}%</span>
                    </div>
                    <p className="text-sm text-gray-600">{domain.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Roles */}
          {profile.recommendedRoles?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">💼 Roles You May Like</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.recommendedRoles.map((role, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{role.title}</span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{role.domain}</span>
                    </div>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Gaps */}
          {profile.skillGaps?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">📚 Skills to Develop</h3>
              <div className="space-y-3">
                {profile.skillGaps.map((gap, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium min-w-[150px]">{gap.skill}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      gap.importance === 'high' ? 'bg-red-100 text-red-800' : 
                      gap.importance === 'medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {gap.importance}
                    </span>
                    {gap.resources?.length > 0 && (
                      <div className="text-sm text-gray-600">
                        Resources: {gap.resources.slice(0, 2).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {profile.recommendedCertifications?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">📜 Recommended Certifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.recommendedCertifications.map((cert, i) => (
                  <div key={i} className="border rounded-lg p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{cert.name}</p>
                      <p className="text-sm text-gray-500">{cert.provider}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      cert.priority === 'essential' ? 'bg-red-100 text-red-800' :
                      cert.priority === 'recommended' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {cert.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggested Projects */}
          {profile.suggestedProjects?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">🛠️ Project Ideas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.suggestedProjects.map((project, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{project.title}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                        project.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                    {project.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((t, j) => (
                          <span key={j} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Learning Roadmap */}
          {profile.learningRoadmap?.length > 0 && (
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold mb-4">🗺️ Learning Roadmap</h3>
              <div className="space-y-4">
                {profile.learningRoadmap.map((phase, i) => (
                  <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{phase.phase}</span>
                      <span className="text-sm text-gray-500">({phase.duration})</span>
                    </div>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {phase.goals?.map((g, j) => <li key={j}>{g}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerGuidance;

