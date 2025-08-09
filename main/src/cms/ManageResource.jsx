import React, { useEffect, useState } from "react";
import { Search, Trash2, Edit3 } from "lucide-react";
import { toast } from "react-hot-toast";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { db, storage } from "../api/firebase";
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

  // Delete handler with SweetAlert2
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
        ? "#1f2937" // dark mode bg
        : "#ffffff",
      color: document.documentElement.classList.contains("dark")
        ? "#f9fafb" // dark mode text
        : "#111827",
    });

    if (result.isConfirmed) {
      try {
        // Delete from storage if file exists
        if (resource.storagePath) {
          const fileRef = ref(storage, resource.storagePath);
          await deleteObject(fileRef);
        }

        // Delete from Firestore
        await deleteDoc(doc(db, "resources", resource.id));

        toast.success("Resource deleted");
      } catch (error) {
        console.error("Error deleting resource:", error);
        toast.error("Failed to delete resource");
      }
    }
  };

  // Filtered results
  const filteredResources = resources.filter(
    (res) =>
      res.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-700 dark:text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">📂 Manage Resources</h2>

      {/* Search */}
      <div className="flex items-center gap-2 mb-4">
        <Search size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search by title, subject, category..."
          className="w-full p-2 border rounded-md dark:bg-gray-800 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-gray-500">Loading resources...</p>
      ) : filteredResources.length === 0 ? (
        <p className="text-gray-500">No resources found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                <th className="p-3">Category</th>
                <th className="p-3">Program</th>
                <th className="p-3">Year</th>
                <th className="p-3">Subject</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res) => (
                <tr
                  key={res.id}
                  className="border-b border-gray-700 dark:border-white"
                >
                  <td className="p-3">{res.category}</td>
                  <td className="p-3">{res.program}</td>
                  <td className="p-3">{res.year}</td>
                  <td className="p-3">{res.subject}</td>
                  <td className="p-3 text-right flex gap-2 justify-end">
                    <button
                      className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() => toast("Edit feature coming soon!")}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleDelete(res)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageResources;
