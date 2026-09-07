/**
 * Resume version repository.
 *
 * Every save of a resume in the editor creates a new version
 * so the user can rewind or compare drafts.
 */
import { versionId } from "../utils/ids.js";
import { getStore } from "./memoryStore.js";
import { assertFirebase, db } from "../config/firebaseAdmin.js";
import { env } from "../config/env.js";
import { notFound } from "../utils/httpError.js";

const COLLECTION = "resume_versions";

const useFirebase = () => env.STORAGE === "firebase";
const inMemory = () => getStore().collection(COLLECTION);
const fromFirestore = (snap) => (snap.exists ? { _id: snap.id, ...snap.data() } : null);

export const versionRepository = {
  async create({ projectId, userId, content, templateId, label }) {
    const id = versionId();
    const doc = {
      projectId,
      userId: userId || null,
      content,
      templateId: templateId || "classic",
      label: label || null,
    };
    if (useFirebase()) {
      assertFirebase();
      await db.collection(COLLECTION).doc(id).set({
        ...doc,
        _createdAt: new Date().toISOString(),
        _updatedAt: new Date().toISOString(),
      });
    } else {
      await inMemory().create(id, doc);
    }
    return { id, ...doc };
  },

  async get(id) {
    if (useFirebase()) {
      assertFirebase();
      const snap = await db.collection(COLLECTION).doc(id).get();
      return fromFirestore(snap);
    }
    return inMemory().get(id);
  },

  async listByProject(projectId) {
    if (useFirebase()) {
      assertFirebase();
      const snap = await db
        .collection(COLLECTION)
        .where("projectId", "==", projectId)
        .get();
      return snap.docs.map(fromFirestore);
    }
    return (await inMemory().where("projectId", "==", projectId)).sort(
      (a, b) => (b._createdAt || "").localeCompare(a._createdAt || "")
    );
  },

  async delete(id) {
    if (useFirebase()) {
      assertFirebase();
      await db.collection(COLLECTION).doc(id).delete();
    } else {
      await inMemory().delete(id);
    }
    return { id };
  },
};
