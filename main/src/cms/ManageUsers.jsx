import React, { useState, useEffect } from "react";
import { db, auth } from "../api/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    uid: "",
    fullName: "",
    email: "",
    role: "uploader",
  });
  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(
        snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      );
      setLoading(false);
    });

    return unsub;
  }, []);

  // Add new user
  const handleAddUser = async () => {
    if (!newUser.uid || !newUser.email || !newUser.role) {
      Swal.fire("Error", "UID, Email and Role are required", "error");
      return;
    }

    try {
      await setDoc(doc(db, "users", newUser.uid), {
        fullName: newUser.fullName || "",
        email: newUser.email,
        role: newUser.role,
      });
      setShowModal(false);
      setNewUser({ uid: "", fullName: "", email: "", role: "uploader" });
      Swal.fire("Success", "User added successfully", "success");
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire("Error", "Failed to add user", "error");
    }
  };

  // Update role
  const handleRoleChange = async (uid, newRole) => {
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      Swal.fire({
        icon: "success",
        title: "Role updated",
        text: `User role changed to ${newRole}`,
        timer: 1200,
        showConfirmButton: false,
        background: document.documentElement.classList.contains("dark")
          ? "#1f2937"
          : "#fff",
        color: document.documentElement.classList.contains("dark")
          ? "#f9fafb"
          : "#111827",
      });
    } catch (error) {
      console.error("Error updating role:", error);
      Swal.fire("Error", "Failed to update role", "error");
    }
  };

  // Delete user
  const handleDelete = async (uid) => {
    if (uid === currentUserId) {
      Swal.fire("Error", "You cannot delete your own account", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently remove the user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      background: document.documentElement.classList.contains("dark")
        ? "#1f2937"
        : "#fff",
      color: document.documentElement.classList.contains("dark")
        ? "#f9fafb"
        : "#111827",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteDoc(doc(db, "users", uid));
          Swal.fire("Deleted!", "User has been removed.", "success");
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire("Error", "Failed to delete user", "error");
        }
      }
    });
  };

  return (
    <div className="p-4 mt-18 sm:p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
          Manage Users
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-gray-800 
           px-4 py-2 rounded transition duration-300 ease-in-out"
        >
          + Add New User
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 dark:border-gray-700 rounded-lg">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-200">
                  Role
                </th>
                <th className="px-4 py-2 text-center text-gray-700 dark:text-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                  >
                    <td className="px-4 py-2 text-gray-900 dark:text-gray-100">
                      {user.fullName || "-"}
                    </td>
                    <td className="px-4 py-2 text-gray-700 dark:text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={user.role || ""}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      >
                        <option value="admin">Admin</option>
                        <option value="uploader">Uploader</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUserId}
                        className={`px-3 py-1 rounded transition ${
                          user.id === currentUserId
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"
                        }`}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-3 text-center text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}


      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Add New User
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  UID
                </label>
                <input
                  type="text"
                  placeholder="Unique Firebase UID"
                  value={newUser.uid}
                  onChange={(e) =>
                    setNewUser({ ...newUser, uid: e.target.value })
                  }
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Name (optional)
                </label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="w-full mt-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="uploader">Uploader</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                     text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
