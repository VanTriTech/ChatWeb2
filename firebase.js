import { getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-storage.js";

const db = window.db;
const storage = window.storage;

// Hàm upload media lên Firebase Storage
export async function uploadMedia(file) {
  const storageRef = ref(storage, `media/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

// Các hàm CRUD cho posts
export async function createPost(postData) {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      ...postData,
      timestamp: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating post: ", error);
    throw error;
  }
}

export async function getPosts() {
  try {
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting posts: ", error);
    throw error;
  }
}

export async function updatePost(postId, data) {
  try {
    const postRef = doc(db, "posts", postId);
    await updateDoc(postRef, data);
  } catch (error) {
    console.error("Error updating post: ", error);
    throw error;
  }
}

export async function deletePost(postId) {
  try {
    await deleteDoc(doc(db, "posts", postId));
  } catch (error) {
    console.error("Error deleting post: ", error);
    throw error;
  }
}
