/**
 * Export job repository — tracks the lifecycle of PDF exports.
 *
 * Even though the current PDF export is synchronous, persisting
 * the job means a future async implementation (e.g. via a worker
 * queue) won't need API changes.
 */
import { exportJobId } from "../utils/ids.js";
import { EXPORT_STATUS } from "../config/constants.js";
import { getStore } from "./memoryStore.js";
import { assertFirebase, db } from "../config/firebaseAdmin.js";
import { env } from "../config/env.js";
import { notFound } from "../utils/httpError.js";

const COLLECTION = "export_jobs";
const useFirebase = () => env.STORAGE === "firebase";
const inMemory = () => getStore().collection(COLLECTION);
const fromFirestore = (snap) => (snap.exists ? { _id: snap.id, ...snap.data() } : null);

export const exportJobRepository = {
  async create({ projectId, userId, type = "pdf", templateId }) {
    const id = exportJobId();
    const doc = {
      projectId,
      userId: userId || null,
      type,
      templateId: templateId || "classic",
      status: EXPORT_STATUS.PENDING,
      resultUrl: null,
      error: null,
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

  async getOrThrow(id) {
    const job = await this.get(id);
    if (!job) throw notFound("Export job");
    return job;
  },

  async update(id, patch) {
    if (useFirebase()) {
      assertFirebase();
      const ref = db.collection(COLLECTION).doc(id);
      const snap = await ref.get();
      if (!snap.exists) throw notFound("Export job");
      await ref.update({ ...patch, _updatedAt: new Date().toISOString() });
      const updated = await ref.get();
      return fromFirestore(updated);
    }
    const updated = await inMemory().update(id, patch);
    if (!updated) throw notFound("Export job");
    return updated;
  },
};
