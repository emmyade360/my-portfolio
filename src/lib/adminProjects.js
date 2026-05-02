import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const projectsRef = collection(db, "projects");

const dispatchUpdate = () => {
  window.dispatchEvent(new Event("admin-projects-updated"));
};

export const getAdminProjects = async () => {
  try {
    const q = query(projectsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

export const saveAdminProject = async (project) => {
  try {
    await addDoc(projectsRef, {
      ...project,
      createdAt: serverTimestamp(),
    });
    dispatchUpdate();
    return true;
  } catch (error) {
    console.error("Error saving project:", error);
    return false;
  }
};

export const deleteAdminProject = async (id) => {
  try {
    await deleteDoc(doc(db, "projects", id));
    dispatchUpdate();
    return true;
  } catch (error) {
    console.error("Error deleting project:", error);
    return false;
  }
};

export const updateAdminProject = async (id, patch) => {
  try {
    const ref = doc(db, "projects", id);
    await updateDoc(ref, patch);
    dispatchUpdate();
    return true;
  } catch (error) {
    console.error("Error updating project:", error);
    return false;
  }
};
