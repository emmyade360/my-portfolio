const KEY = "portfolio-admin-projects";

export const getAdminProjects = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
};

export const saveAdminProject = (project) => {
  const existing = getAdminProjects();
  const updated = [...existing, { ...project, id: `admin-${Date.now()}` }];
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("admin-projects-updated"));
};

export const deleteAdminProject = (id) => {
  const updated = getAdminProjects().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("admin-projects-updated"));
};

export const updateAdminProject = (id, patch) => {
  const updated = getAdminProjects().map((p) => (p.id === id ? { ...p, ...patch } : p));
  localStorage.setItem(KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("admin-projects-updated"));
};
