import api from "../api";

// HTTP adapter for the local repository contract in BIOREPO_API.md.
// Replace imports of the local bioRepository functions with these methods when
// the backend is available; page-level business rules remain unchanged.
const resource = (name) => ({
  list: (params) => api.get(`/api/v1/${name}`, { params }),
  get: (id) => api.get(`/api/v1/${name}/${id}`),
  create: (data) => api.post(`/api/v1/${name}`, data),
  update: (id, data) => api.patch(`/api/v1/${name}/${id}`, data),
  remove: (id) => api.delete(`/api/v1/${name}/${id}`),
});

export const bioApi = {
  lookups: (group, params) => api.get(`/api/v1/lookups/${group}`, { params }),
  allLookups: () => api.get("/api/v1/lookups/all"),
  facilities: resource("facilities"),
  storageUnits: {
    ...resource("storage-units"),
    tree: (id) => api.get(`/api/v1/storage-units/${id}/tree`),
    capacity: (id, params) => api.get(`/api/v1/storage-units/${id}/capacity`, { params }),
    generateStructure: (id, data) => api.post(`/api/v1/storage-units/${id}/generate-structure`, data),
  },
  projects: {
    ...resource("projects"),
    submit: (id) => api.post(`/api/v1/projects/${id}/submit`),
    approve: (id) => api.post(`/api/v1/projects/${id}/approve`),
    members: (id, data) => data ? api.post(`/api/v1/projects/${id}/members`, data) : api.get(`/api/v1/projects/${id}/members`),
    storageSummary: (id) => api.get(`/api/v1/projects/${id}/storage-summary`),
  },
  storageRequests: { ...resource("storage-requests"), recommendations: (id, data) => api.post(`/api/v1/storage-requests/${id}/recommendations`, data), approve: (id) => api.post(`/api/v1/storage-requests/${id}/approve`) },
  allocations: resource("storage-allocations"),
  samples: { ...resource("samples"), currentLocation: (id) => api.get(`/api/v1/samples/${id}/current-location`), history: (id) => api.get(`/api/v1/samples/${id}/history`), checkout: (id, data) => api.post(`/api/v1/samples/${id}/checkout`, data), return: (id, data) => api.post(`/api/v1/samples/${id}/return`, data) },
  placements: resource("placements"),
  movements: resource("sample-movements"),
  quantityTransactions: (id, data) => data ? api.post(`/api/v1/samples/${id}/quantity-transactions`, data) : api.get(`/api/v1/samples/${id}/quantity-transactions`),
  clinicalSamples: resource("clinical-samples"),
  temperature: { readings: resource("temperature-readings"), series: (id, params) => api.get(`/api/v1/storage-units/${id}/temperature-series`, { params }), excursions: resource("temperature-excursions") },
  alerts: resource("alerts"),
  audit: resource("audit-events"),
  dashboard: { summary: (params) => api.get("/api/v1/dashboard/summary", { params }), capacity: (params) => api.get("/api/v1/dashboard/capacity", { params }), temperature: (params) => api.get("/api/v1/dashboard/temperature", { params }), recentMovements: (params) => api.get("/api/v1/dashboard/recent-movements", { params }), recentActivity: (params) => api.get("/api/v1/dashboard/recent-activity", { params }) },
};

export default bioApi;
