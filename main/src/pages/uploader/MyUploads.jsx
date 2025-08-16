import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../../api/firebase";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight } from "lucide-react";


export default function MyUploads() {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const itemsPerPage = 7;
  const auth = getAuth();

    const [filters, setFilters] = useState({
    search: "",
    semester: "",
    type: "",
  });


  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      try {
        let q = query(
          collection(db, "resources"),
          where("uploadedBy", "==", auth.currentUser.uid)
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

        setUploads(data);
      } catch (error) {
        console.error("Error fetching uploads:", error);
        toast.error("Failed to fetch uploads.");
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchUploads();
  }, [auth.currentUser]);

  const handleDelete = async (id, storagePath) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteObject(ref(storage, storagePath));
        await deleteDoc(doc(db, "resources", id));
        setUploads((prev) => prev.filter((item) => item.id !== id));
        toast.success("File deleted successfully.");
      } catch (error) {
        console.error("Error deleting file:", error);
        toast.error("Failed to delete file.");
      }
    }
  };

  // ✅ Pagination directly from uploads
  const totalPages = Math.ceil(uploads.length / itemsPerPage);
  const paginatedUploads = uploads.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">📂 My Uploads</h1>

      {/* Search + Filters */}
   

      {/* Table for desktop */}
      <div className="hidden md:block">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : paginatedUploads.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No uploads found.</p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Sem</th>
                  <th className="p-3">Program</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Uploaded</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUploads.map((upload, i) => (
                  <motion.tr
                    key={upload.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <td className="p-3 font-medium">
                      {upload.title || "Untitled"}
                    </td>
                    <td className="p-3">{upload.subject}</td>
                    <td className="p-3 uppercase font-semibold">
                      <span
                        className={`px-2 py-1 rounded ${
                          upload.category === "pyq"
                            ? "bg-yellow-200 dark:bg-yellow-600"
                            : "bg-green-200 dark:bg-green-600"
                        }`}
                      >
                        {upload.category}
                      </span>
                    </td>
                    <td className="p-3">{upload.year}</td>
                    <td className="p-3">{upload.semester}</td>
                    <td className="p-3">{upload.program}</td>
                    <td className="p-3">
                      {(upload.fileSize / 1024).toFixed(1)} KB
                    </td>
                    <td className="p-3">
                      {upload.createdAt?.seconds
                        ? new Date(
                            upload.createdAt.seconds * 1000
                          ).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3 flex gap-3">
                      <a
                        href={upload.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                      >
                        View
                      </a>
                      <button
                        onClick={() =>
                          handleDelete(upload.id, upload.storagePath)
                        }
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Card view for mobile */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="text-center py-10">Loading...</div>
        ) : paginatedUploads.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No uploads found.</p>
        ) : (
          paginatedUploads.map((upload, i) => (
            <motion.div
              key={upload.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">
                  {upload.title || "Untitled"}
                </h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-medium ${
                    upload.category === "pyq"
                      ? "bg-yellow-200 dark:bg-yellow-600"
                      : "bg-green-200 dark:bg-green-600"
                  }`}
                >
                  {upload.category}
                </span>
              </div>
              <p>
                <strong>Subject:</strong> {upload.subject}
              </p>
              <p>
                <strong>Program:</strong> {upload.program},{" "}
                <strong>Year:</strong> {upload.year}, <strong>Sem:</strong>{" "}
                {upload.semester}
              </p>
              <p>
                <strong>Size:</strong> {(upload.fileSize / 1024).toFixed(1)} KB
              </p>
              <p>
                <strong>Uploaded:</strong>{" "}
                {upload.createdAt?.seconds
                  ? new Date(
                      upload.createdAt.seconds * 1000
                    ).toLocaleDateString()
                  : "-"}
              </p>
              <div className="flex gap-4 mt-2">
                <a
                  href={upload.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 dark:text-blue-400 hover:underline"
                >
                  View
                </a>
                <button
                  onClick={() => handleDelete(upload.id, upload.storagePath)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50 flex items-center gap-1"
          >
            <ChevronLeft /> Prev
          </button>
          <span className="font-medium">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-300 dark:bg-gray-700 rounded disabled:opacity-50 flex items-center gap-1"
          >
            Next <ChevronRight />
          </button>
        </div>
      )}
    </div>
  );
}