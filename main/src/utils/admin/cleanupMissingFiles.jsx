// utils/cleanupMissingFiles.js
import { db, storage } from "../../api/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { ref, getMetadata } from "firebase/storage";

export const cleanupMissingFiles = async () => {
  const resourcesSnapshot = await getDocs(collection(db, "resources"));

  for (const docSnap of resourcesSnapshot.docs) {
    const { storagePath } = docSnap.data();
    const fileRef = ref(storage, storagePath);

    try {
      await getMetadata(fileRef); // ✅ file exists
    } catch (error) {
      if (error.code === "storage/object-not-found") {
        console.log(`Deleting Firestore doc: ${docSnap.id}`);
        await deleteDoc(doc(db, "resources", docSnap.id));
      }
    }
  }
};
