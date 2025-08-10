import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const createOrUpdateAdminProfile = async (uid, profileData) => {
  try {
    const adminRef = doc(db, "admins", uid);
    await setDoc(adminRef, {
      ...profileData,
      joinedAt: serverTimestamp(),
    }, { merge: true }); // merge to update without overwriting everything
    console.log("Profile created/updated successfully.");
  } catch (error) {
    console.error("Error creating/updating profile:", error);
    throw error;
  }
};
