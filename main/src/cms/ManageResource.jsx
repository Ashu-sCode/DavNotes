import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { db, storage } from "../api/firebase";
import SearchBar from "../components/SearchBar";
import ResourcesTable from "../components/admin/ResourcesTable";
import FloatingUploadButton from "../components/admin/FloatingUploadButton";
import Spinner from "../utils/Spinner";
import { useNavigate } from "react-router-dom";
import FloatingDeleteButton from "../components/admin/FloatingDeleteButton";

const MySwal = withReactContent(Swal);

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters
  const [filterCategory, setFilterCategory] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const navigate = useNavigate();

  // Fetch filtered resources
  const fetchFilteredResources = () => {
    setLoading(true);

    // Build Firestore query dynamically
    let q = collection(db, "resources");
    let conditions = [];

    if (filterCategory)
      conditions.push(where("category", "==", filterCategory));
    if (filterProgram) conditions.push(where("program", "==", filterProgram));
    if (filterSubject) conditions.push(where("subject", "==", filterSubject));

    if (conditions.length > 0) {
      q = query(q, ...conditions);
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetched = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        setResources(fetched);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching filtered resources:", error);
        toast.error("Failed to load resources");
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchFilteredResources();
    return () => unsubscribe();
  }, [filterCategory, filterProgram, filterSubject]);

  // Delete resource
  const handleDelete = async (resource) => {
    const result = await MySwal.fire({
      title: "Delete Resource?",
      text: `Are you sure you want to delete "${
        resource.title || "this resource"
      }"?`,
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

  // Edit resource
  const handleEdit = (resource) => {
    toast("Edit feature coming soon!");
  };

  // Unique filter lists — keep them from ALL docs, not just filtered ones
  const [allCategories, setAllCategories] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  // Fetch unique filter lists
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "resources"), (snapshot) => {
      const docs = snapshot.docs.map((d) => d.data());
      setAllCategories(
        [...new Set(docs.map((r) => r.category))].filter(Boolean)
      );
      setAllPrograms([...new Set(docs.map((r) => r.program))].filter(Boolean));
      setAllSubjects([...new Set(docs.map((r) => r.subject))].filter(Boolean));
    });
    return () => unsub();
  }, []);

  const filteredResources = resources.filter(
    (res) =>
      res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === resources.length) {
      setSelectedIds([]); // deselect all
    } else {
      setSelectedIds(resources.map((r) => r.id)); // select all
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    const result = await MySwal.fire({
      title: `Delete ${selectedIds.length} selected resources?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete them!",
      background: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#f9fafb"
        : "#111827",
    });

    if (result.isConfirmed) {
      try {
        // For each selected resource, delete from storage and firestore
        for (const id of selectedIds) {
          const resource = resources.find((r) => r.id === id);
          if (resource) {
            if (resource.storagePath) {
              const fileRef = ref(storage, resource.storagePath);
              await deleteObject(fileRef);
            }
            await deleteDoc(doc(db, "resources", id));
          }
        }
        toast.success(`${selectedIds.length} resources deleted`);
        setSelectedIds([]); // clear selection after deletion
      } catch (error) {
        console.error("Error deleting resources:", error);
        toast.error("Failed to delete selected resources");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-lg transition-colors duration-500">
      <h2 className="text-2xl font-bold mb-4">📂 Manage Resources</h2>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
        <div className="flex-1">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterCategory={filterCategory}
            setFilterCategory={setFilterCategory}
            filterProgram={filterProgram}
            setFilterProgram={setFilterProgram}
            filterSubject={filterSubject}
            setFilterSubject={setFilterSubject}
            allCategories={allCategories}
            allPrograms={allPrograms}
            allSubjects={allSubjects}
          />
        </div>
      </div>

      {/* Batch Actions */}
      {selectedIds.length > 0 && (
        <FloatingDeleteButton
          onClick={handleBatchDelete}
          count={selectedIds.length}
        />
      )}

      {/* Results Section */}
      <div className="relative min-h-[200px]">
        {/* Overlay Spinner (no flicker) */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm z-10 transition-opacity duration-300">
            <Spinner size={48} />
          </div>
        )}

        {/* Animated Content */}
        <div>
          {filteredResources.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-100">
              No resources found. Try adjusting your search or{" "}
              <button
                onClick={() => navigate("/admin/upload")}
                className="text-indigo-500 underline hover:text-indigo-600"
              >
                uploading a new one
              </button>
              .
            </p>
          ) : (
            <div className="animate-fadeIn">
              <ResourcesTable
                resources={filteredResources}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onEdit={handleEdit}
                toggleSelect={toggleSelect}
                toggleSelectAll={toggleSelectAll}
                showDownloadCount={true}
              />
            </div>
          )}
        </div>
      </div>

      <FloatingUploadButton />
    </div>
  );
};

export default ManageResources;
