import { useEffect, useState, useMemo } from "react";
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
import DOMPurify from "dompurify";

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

  // Fetch uploads
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

  // Delete upload
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

    if (!result.isConfirmed) return;

    try {
      await deleteObject(ref(storage, storagePath));
      await deleteDoc(doc(db, "resources", id));
      setUploads((prev) => prev.filter((item) => item.id !== id));
      toast.success("File deleted successfully.");
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Failed to delete file.");
    }
  };

  // Apply filters
  const filteredUploads = useMemo(() => {
    return uploads.filter((upload) => {
      const search = DOMPurify.sanitize(filters.search).toLowerCase();
      const type = DOMPurify.sanitize(filters.type);
      const semester = DOMPurify.sanitize(filters.semester);

      const matchesSearch =
        !search ||
        upload.title?.toLowerCase().includes(search) ||
        upload.subject?.toLowerCase().includes(search);

      const matchesType = !type || upload.category === type;
      const matchesSemester = !semester || upload.semester === semester;

      return matchesSearch && matchesType && matchesSemester;
    });
  }, [uploads, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredUploads.length / itemsPerPage);
  const paginatedUploads = filteredUploads.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto p-6 mt-20 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl font-bold mb-6">📂 My Uploads</h1>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by title or subject..."
          className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:text-white"
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />
        <select
          className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={filters.semester}
          onChange={(e) =>
            setFilters((f) => ({ ...f, semester: e.target.value }))
          }
        >
          <option value="">All Semesters</option>
          {[...new Set(uploads.map((u) => u.semester))].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
        >
          <option value="">All Types</option>
          {["notes", "pyq", "assignment", "syllabus"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {/* Upload Table / Cards */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : paginatedUploads.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No uploads found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-300 dark:border-gray-700">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Semester</th>
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
                      {DOMPurify.sanitize(upload.title || "Untitled")}
                    </td>
                    <td className="p-3">{DOMPurify.sanitize(upload.subject)}</td>
                    <td className="p-3 uppercase font-semibold">
                      <span
                        className={`px-2 py-1 rounded ${
                          upload.category === "pyq"
                            ? "bg-yellow-200 dark:bg-yellow-600"
                            : "bg-green-200 dark:bg-green-600"
                        }`}
                      >
                        {DOMPurify.sanitize(upload.category)}
                      </span>
                    </td>
                    <td className="p-3">{DOMPurify.sanitize(upload.semester)}</td>
                    <td className="p-3">{(upload.fileSize / 1024).toFixed(1)} KB</td>
                    <td className="p-3">
                      {upload.createdAt?.seconds
                        ? new Date(upload.createdAt.seconds * 1000).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="p-3 flex gap-3">
                      <a
                        href={DOMPurify.sanitize(upload.fileUrl)}
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
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedUploads.map((upload, i) => (
              <motion.div
                key={upload.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    {DOMPurify.sanitize(upload.title || "Untitled")}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded text-sm font-medium ${
                      upload.category === "pyq"
                        ? "bg-yellow-200 dark:bg-yellow-600"
                        : "bg-green-200 dark:bg-green-600"
                    }`}
                  >
                    {DOMPurify.sanitize(upload.category)}
                  </span>
                </div>
                <p>
                  <strong>Subject:</strong> {DOMPurify.sanitize(upload.subject)}
                </p>
                <p>
                  <strong>Semester:</strong> {DOMPurify.sanitize(upload.semester)}
                </p>
                <p>
                  <strong>Size:</strong> {(upload.fileSize / 1024).toFixed(1)} KB
                </p>
                <p>
                  <strong>Uploaded:</strong>{" "}
                  {upload.createdAt?.seconds
                    ? new Date(upload.createdAt.seconds * 1000).toLocaleDateString()
                    : "-"}
                </p>
                <div className="flex gap-4 mt-2">
                  <a
                    href={DOMPurify.sanitize(upload.fileUrl)}
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
            ))}
          </div>
        </>
      )}

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
