import React from 'react';

const weakSubjects = [
  { name: 'History', currentMarks: 70, targetMarks: 85, priority: 'High' },
  { name: 'Physics', currentMarks: 78, targetMarks: 90, priority: 'Medium' },
  { name: 'Chemistry', currentMarks: 82, targetMarks: 90, priority: 'Low' },
];

const weeklyPlan = [
  { day: 'Monday', tasks: ['History - Chapter 5 review', 'Physics - Problem set 3'], duration: '2h' },
  { day: 'Tuesday', tasks: ['Chemistry - Lab preparation', 'Mathematics - Practice problems'], duration: '2.5h' },
  { day: 'Wednesday', tasks: ['English - Essay writing', 'History - Timeline exercise'], duration: '2h' },
  { day: 'Thursday', tasks: ['Physics - Conceptual review', 'Computer Science - Coding practice'], duration: '3h' },
  { day: 'Friday', tasks: ['All subjects - Quick revision', 'Weekly quiz completion'], duration: '2h' },
  { day: 'Saturday', tasks: ['Weak subject deep dive', 'Practice tests'], duration: '4h' },
  { day: 'Sunday', tasks: ['Rest day - Light reading', 'Plan for next week'], duration: '1h' },
];

const contentCards = [
  {
    title: 'Revision Notes',
    description: 'AI-generated summary notes for all subjects based on your performance',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    color: 'bg-blue-500',
    buttonText: 'View Notes',
  },
  {
    title: 'Practice Quizzes',
    description: 'Topic-wise quizzes to test your understanding and identify gaps',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    color: 'bg-green-500',
    buttonText: 'Start Quiz',
  },
  {
    title: 'Interview Questions',
    description: 'Common interview questions for your target roles with sample answers',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-purple-500',
    buttonText: 'Practice Now',
  },
  {
    title: 'Video Tutorials',
    description: 'Curated video content based on your weak topics',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-red-500',
    buttonText: 'Watch Now',
  },
  {
    title: 'Flashcards',
    description: 'Quick revision flashcards for important concepts',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    color: 'bg-yellow-500',
    buttonText: 'Study Cards',
  },
  {
    title: 'Mock Tests',
    description: 'Full-length mock tests to simulate exam conditions',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'bg-indigo-500',
    buttonText: 'Take Test',
  },
];

const Learning = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-3xl font-bold text-gray-800 mb-6">Learning & Study Plan</h1>
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-red-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Subjects Needing Attention</h2>
            <p className="text-sm text-gray-500">Focus on these to improve your overall performance</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weakSubjects.map((subject, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800">{subject.name}</h3>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    subject.priority === 'High'
                      ? 'bg-red-100 text-red-700'
                      : subject.priority === 'Medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {subject.priority} Priority
                </span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Current</span>
                  <span className="font-medium">{subject.currentMarks}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${subject.currentMarks}%` }} />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Target</span>
                  <span className="font-medium text-green-600">{subject.targetMarks}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${subject.targetMarks}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Recommended Study Plan</h2>
            <p className="text-sm text-gray-500">AI-generated weekly schedule based on your needs</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {weeklyPlan.map((day, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-medium text-gray-900">{day.day}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      {day.tasks.map((task, taskIndex) => (
                        <span key={taskIndex} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md">
                          {task}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="inline-flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {day.duration}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="flex items-center mb-6">
          <div className="p-3 bg-purple-100 rounded-lg mr-4">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">AI-Powered Learning Resources</h2>
            <p className="text-sm text-gray-500">Personalized content based on your performance data</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contentCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg ${card.color} text-white`}>
                  {card.icon}
                </div>
                <h3 className="ml-4 font-semibold text-gray-800">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">{card.description}</p>
              <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors">
                {card.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Learning;

