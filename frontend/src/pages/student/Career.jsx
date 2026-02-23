import React from 'react';

const careerDomains = [
  {
    title: 'Software Developer',
    match: 92,
    description: 'Build applications and systems using programming languages',
    salary: '$70K - $150K',
    growth: 'High',
    skills: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL'],
  },
  {
    title: 'Data Analyst',
    match: 85,
    description: 'Analyze data to help businesses make better decisions',
    salary: '$60K - $120K',
    growth: 'High',
    skills: ['SQL', 'Python', 'Excel', 'Tableau', 'Statistics'],
  },
  {
    title: 'ML Engineer',
    match: 78,
    description: 'Design and deploy machine learning models',
    salary: '$90K - $180K',
    growth: 'Very High',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Math', 'Deep Learning'],
  },
  {
    title: 'Product Manager',
    match: 75,
    description: 'Lead product development and strategy',
    salary: '$80K - $160K',
    growth: 'Medium',
    skills: ['Communication', 'Strategy', 'Analytics', 'UX', 'Agile'],
  },
];

const currentSkills = [
  'JavaScript',
  'Python',
  'HTML/CSS',
  'Git',
  'Problem Solving',
  'Communication',
  'Teamwork',
  'Data Analysis',
];

const missingSkills = {
  'Software Developer': ['System Design', 'Docker', 'AWS', 'CI/CD', 'TypeScript'],
  'Data Analyst': ['Advanced SQL', 'Tableau', 'R', 'Data Visualization', 'Business Intelligence'],
  'ML Engineer': ['TensorFlow', 'PyTorch', 'Linear Algebra', 'Statistics', 'MLOps'],
  'Product Manager': ['User Research', 'Roadmapping', 'A/B Testing', 'Scrum', 'Stakeholder Management'],
};

const careerRoadmap = [
  {
    phase: 'Foundation (Year 1-2)',
    title: 'Build Core Skills',
    tasks: [
      'Master programming fundamentals',
      'Complete data structures & algorithms',
      'Build 5+ personal projects',
      'Learn version control (Git)',
    ],
    status: 'completed',
  },
  {
    phase: 'Specialization (Year 2-3)',
    title: 'Choose Career Path',
    tasks: [
      'Pick a specialization (Web/ML/Data)',
      'Complete specialized certifications',
      'Internship or part-time work',
      'Build portfolio projects',
    ],
    status: 'in-progress',
  },
  {
    phase: 'Growth (Year 3-4)',
    title: 'Launch Career',
    tasks: [
      'Prepare for technical interviews',
      'Network with industry professionals',
      'Apply for full-time positions',
      'Contribute to open source',
    ],
    status: 'upcoming',
  },
  {
    phase: 'Advancement (Year 4+)',
    title: 'Senior Roles',
    tasks: [
      'Lead projects and mentor juniors',
      'Develop system design expertise',
      'Consider advanced degree options',
      'Build personal brand',
    ],
    status: 'upcoming',
  },
];

const Career = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Career Guidance</h1>

      <div className="mb-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Suggested Career Paths</h2>
            <p className="text-sm text-gray-500">Based on your skills and performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {careerDomains.map((career, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{career.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{career.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{career.match}%</div>
                  <div className="text-xs text-gray-400">Match Score</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${career.match}%` }}
                />
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                  💰 {career.salary}
                </span>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                  📈 {career.growth} Growth
                </span>
              </div>

              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-2">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {career.skills.map((skill, skillIndex) => (
                    <span
                      key={skillIndex}
                      className={`px-2 py-1 text-xs rounded ${
                        currentSkills.includes(skill)
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-yellow-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Skill Gap Analysis</h2>
            <p className="text-sm text-gray-500">Skills you need to develop for each career path</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Your Current Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Skills to Develop
            </h3>
            <div className="flex flex-wrap gap-2">
              {['System Design', 'Docker', 'AWS', 'CI/CD', 'TypeScript', 'TensorFlow', 'MLOps', 'User Research'].map(
                (skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Career Roadmap</h2>
            <p className="text-sm text-gray-500">Your personalized path to career success</p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

          <div className="space-y-8">
            {careerRoadmap.map((milestone, index) => (
              <div key={index} className="relative flex items-start pl-14">
                <div
                  className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                    milestone.status === 'completed'
                      ? 'bg-green-500 border-green-500'
                      : milestone.status === 'in-progress'
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-white border-gray-300'
                  }`}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        milestone.status === 'completed'
                          ? 'bg-green-100 text-green-700'
                          : milestone.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {milestone.phase}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        milestone.status === 'completed'
                          ? 'text-green-600'
                          : milestone.status === 'in-progress'
                          ? 'text-blue-600'
                          : 'text-gray-400'
                      }`}
                    >
                      {milestone.status === 'completed'
                        ? '✓ Completed'
                        : milestone.status === 'in-progress'
                        ? 'In Progress'
                        : 'Upcoming'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{milestone.title}</h3>
                  <ul className="mt-3 space-y-2">
                    {milestone.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start text-sm text-gray-600">
                        <svg
                          className={`w-4 h-4 mr-2 mt-0.5 flex-shrink-0 ${
                            milestone.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;

