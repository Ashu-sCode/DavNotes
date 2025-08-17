// utils/cleanupMissingFiles.js
import { db, storage } from "../../api/firebase";
import { collection, getDocs, deleteDoc, doc, writeBatch } from "firebase/firestore";
import { ref, getMetadata } from "firebase/storage";

/**
 * Cleans up Firestore documents whose corresponding files
 * in Firebase Storage are missing.
 */
export const cleanupMissingFiles = async () => {
  try {
    const resourcesSnapshot = await getDocs(collection(db, "resources"));

    if (resourcesSnapshot.empty) {
      console.log("No resources found in Firestore.");
      return;
    }

    const batch = writeBatch(db);
    let deletedCount = 0;

    for (const docSnap of resourcesSnapshot.docs) {
      const { storagePath } = docSnap.data();

      if (!storagePath) {
        console.warn(`Skipping doc ${docSnap.id} — no storagePath defined.`);
        continue;
      }

      const fileRef = ref(storage, storagePath);

      try {
        await getMetadata(fileRef); // File exists
      } catch (error) {
        if (error.code === "storage/object-not-found") {
          console.log(`Deleting Firestore doc: ${docSnap.id}`);
          batch.delete(doc(db, "resources", docSnap.id));
          deletedCount++;
        } else {
          console.error(`Error checking file for doc ${docSnap.id}:`, error);
        }
      }
    }

    if (deletedCount > 0) {
      await batch.commit();
      console.log(`✅ Cleanup completed. Deleted ${deletedCount} Firestore docs.`);
    } else {
      console.log("✅ Cleanup completed. No missing files found.");
    }
  } catch (err) {
    console.error("❌ Failed to cleanup missing files:", err);
  }
};
