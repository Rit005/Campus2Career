// frontend/src/api/admin.js
import api from "./api";

const adminAPI = {
  // Overview
  getOverview: () => api.get("/admin/overview"),

  // Users
  getUsers: (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/admin/users?${queryString}`);
  },
  
  toggleUserBlock: (id, block) => 
    api.patch(`/admin/users/${id}/block`, { block }),
  
  deleteUser: (id) => api.delete(`/admin/users/${id}`),

  // Students
  getAtRiskStudents: () => api.get("/admin/students/at-risk"),

  // Analytics
  getSkillTrends: () => api.get("/admin/skill-trends"),
  
  getGrowthAnalytics: (period = 30) => 
    api.get(`/admin/analytics/growth?period=${period}`),
};

export default adminAPI;

