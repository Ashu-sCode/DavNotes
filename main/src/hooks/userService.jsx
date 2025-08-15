import {db} from "../api/firebase";
import { collection, addDoc, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";

export async function addUserToCollection(uid, email, role) {
  await setDoc(doc(db, "users", uid), {
    email,
    role,
    createdAt: serverTimestamp()
  });
}

export async function updateUserRole(uid, newRole) {
  await updateDoc(doc(db, "users", uid), {
    role: newRole
  });
}

export async function deleteUserFromCollection(uid) {
  await deleteDoc(doc(db, "users", uid));
}
