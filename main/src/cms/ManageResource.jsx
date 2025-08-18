import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

import { db, storage } from "../api/firebase";
import SearchBar from "../components/SearchBar";
import ResourcesTable from "../components/admin/ResourcesTable";
import FloatingUploadButton from "../components/admin/FAB/FloatingUploadButton";
import FloatingDownloadButton from "../components/admin/FAB/FloatingDownloadButton";
import FloatingDeleteButton from "../components/admin/FAB/FloatingDeleteButton";
import Spinner from "../utils/Spinner";
import { useNavigate } from "react-router-dom";

const MySwal = withReactContent(Swal);

const ManageResources = () => {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterProgram, setFilterProgram] = useState("");
  const [filterSubject, setFilterSubject] = useState("");

  const [allCategories, setAllCategories] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]);

  const navigate = useNavigate();

  // Fetch resources with optional filters
  const fetchFilteredResources = () => {
    setLoading(true);
    let q = collection(db, "resources");
    const conditions = [];
    if (filterCategory) conditions.push(where("category", "==", filterCategory));
    if (filterProgram) conditions.push(where("program", "==", filterProgram));
    if (filterSubject) conditions.push(where("subject", "==", filterSubject));
    if (conditions.length) q = query(q, ...conditions);

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
        console.error(error);
        toast.error("Failed to load resources");
        setLoading(false);
      }
    );

    return unsubscribe;
  };

  useEffect(() => {
    const unsub = fetchFilteredResources();
    return () => unsub();
  }, [filterCategory, filterProgram, filterSubject]);

  // Fetch distinct filter options
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "resources"), (snapshot) => {
      const docs = snapshot.docs.map((d) => d.data());
      setAllCategories([...new Set(docs.map((r) => r.category))].filter(Boolean));
      setAllPrograms([...new Set(docs.map((r) => r.program))].filter(Boolean));
      setAllSubjects([...new Set(docs.map((r) => r.subject))].filter(Boolean));
    });
    return () => unsub();
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
      background: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#111827",
    });

    if (result.isConfirmed) {
      try {
        if (resource.storagePath) await deleteObject(ref(storage, resource.storagePath));
        await deleteDoc(doc(db, "resources", resource.id));
        toast.success("Resource deleted");
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete resource");
      }
    }
  };

  const handleEdit = (resource) => toast("Edit feature coming soon!");

  const filteredResources = resources.filter(
    (res) =>
      res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelectAll = () => {
    setSelectedIds(
      selectedIds.length === filteredResources.length
        ? []
        : filteredResources.map((r) => r.id)
    );
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Batch Download
  const handleBatchDownload = async () => {
    if (!selectedIds.length) return toast.error("No resources selected.");
    const selectedResources = resources.filter((r) => selectedIds.includes(r.id));
    if (!selectedResources.length) return toast.error("Selected resources not found.");

    selectedResources.forEach((resource, index) => {
      if (!resource.fileUrl) return toast.error(`No download link for ${resource.title}`);
      setTimeout(() => {
        const link = document.createElement("a");
        link.href = resource.fileUrl;
        link.download = resource.title || `download-${index + 1}`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 300);
    });

    try {
      await Promise.all(
        selectedResources.map((resource) =>
          updateDoc(doc(db, "resources", resource.id), { downloadCount: increment(1) }).catch(console.error)
        )
      );
      toast.success(`Started downloading ${selectedResources.length} files.`);
    } catch {
      toast.error("Some download counts failed to update.");
    }
  };

  // Batch Delete
  const handleBatchDelete = async () => {
    const result = await MySwal.fire({
      title: `Delete ${selectedIds.length} selected resources?`,
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete them!",
      background: document.documentElement.classList.contains("dark") ? "#1f2937" : "#ffffff",
      color: document.documentElement.classList.contains("dark") ? "#f9fafb" : "#111827",
    });

    if (result.isConfirmed) {
      try {
        for (const id of selectedIds) {
          const resource = resources.find((r) => r.id === id);
          if (resource) {
            if (resource.storagePath) await deleteObject(ref(storage, resource.storagePath));
            await deleteDoc(doc(db, "resources", id));
          }
        }
        toast.success(`${selectedIds.length} resources deleted`);
        setSelectedIds([]);
      } catch (error) {
        console.error(error);
        toast.error("Failed to delete selected resources");
      }
    }
  };

  return (
    <div className="max-w-full sm:max-w-6xl mx-auto p-4 sm:p-6 dark:text-white transition-colors duration-500">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center sm:text-left">📂 Manage Resources</h2>

      {/* Search + Filters */}
        <div className="relative min-h-[100px] overflow-x-auto sm:overflow-visible">
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

      {/* Resources Table */}
      <div className="relative min-h-[200px] overflow-x-auto sm:overflow-visible">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm z-10 transition-opacity duration-300">
            <Spinner size={48} />
          </div>
        )}

        {filteredResources.length === 0 && !loading ? (
          <p className="text-gray-500 dark:text-gray-100 text-center sm:text-left">
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
          <ResourcesTable
            resources={filteredResources}
            onDelete={handleDelete}
            onEdit={handleEdit}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            toggleSelectAll={toggleSelectAll}
            loading={loading}
          />
        )}
      </div>

      {/* Batch Actions */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 flex flex-col gap-4">
          <FloatingDownloadButton count={selectedIds.length} onClick={handleBatchDownload} />
          <FloatingDeleteButton count={selectedIds.length} onClick={handleBatchDelete} />
        </div>
      )}

      {/* Upload button */}
      <FloatingUploadButton />
    </div>
  );
};

export default ManageResources;
