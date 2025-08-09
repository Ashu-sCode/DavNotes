import React, { useEffect, useState, useCallback } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { db, storage } from "../api/firebase";
import SearchBar from "../components/SearchBar";
import ResourcesTable from "../components/admin/ResourcesTable";
import { cleanupMissingFiles } from "../utils/admin/cleanupMissingFiles";

const MySwal = withReactContent(Swal);

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cleanupMissingFiles();
  }, []);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, "resources"),
      (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setResources(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to resources:", error);
        toast.error("Failed to load resources");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (resource) => {
    const result = await MySwal.fire({
      title: "Delete Resource?",
      text: `Are you sure you want to delete "${resource.title || "this resource"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#f9fafb"
        : "#111827",
    });

    if (result.isConfirmed) {
      try {
        if (resource.storagePath) {
          const fileRef = ref(storage, resource.storagePath);
          await deleteObject(fileRef);
        }
        await deleteDoc(doc(db, "resources", resource.id));
        toast.success("Resource deleted");
      } catch (error) {
        console.error("Error deleting resource:", error);
        toast.error("Failed to delete resource");
      }
    }
  };

  const filteredResources = resources.filter(
    (res) =>
      res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // For now, edit just shows a toast (you can expand this later)
  const handleEdit = (resource) => {
    toast("Edit feature coming soon!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📂 Manage Resources</h2>

      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {loading ? (
        <p className="text-gray-500">Loading resources...</p>
      ) : filteredResources.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-100">No resources found.</p>
      ) : (
        <ResourcesTable
          resources={filteredResources}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default ManageResources;
