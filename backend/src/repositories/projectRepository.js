/**
 * Project repository.
 *
 * Owns persistence of the top-level "Resume Project" entity that
 * tracks the user's journey through the 19-step flow.
 *
 * The repository is the only layer that knows about the
 * underlying storage. Controllers / services interact with
 * shape-stable DTOs and don't care whether the data lives
 * in memory, Firestore, or Postgres.
 */
import { projectId } from "../utils/ids.js";
import { RESUME_STATUS, ROLES } from "../config/constants.js";
import { getStore } from "./memoryStore.js";
import { assertFirebase, db } from "../config/firebaseAdmin.js";
import { env } from "../config/env.js";
import { notFound } from "../utils/httpError.js";

const COLLECTION = "projects";

const useFirebase = () => env.STORAGE === "firebase";

const inMemory = () => getStore().collection(COLLECTION);

const fromFirestore = (snap) =>
  snap.exists ? { _id: snap.id, ...snap.data() } : null;

const projectDoc = (input) => ({
  userId: input.userId || null,
  targetRole: input.targetRole || null,
  jobDescription: input.jobDescription || "",
  status: input.status || RESUME_STATUS.DRAFT,
  resume: input.resume || null,
  roleAnalysis: input.roleAnalysis || null,
  skillGap: input.skillGap || null,
  blueprint: input.blueprint || null,
  generatedResume: input.generatedResume || null,
  qualityCheck: input.qualityCheck || null,
  templateId: input.templateId || "classic",
  github: input.github || null,
  interview: input.interview || null,
  meta: input.meta || {},
});

export const projectRepository = {
  async create(input) {
    const id = projectId();
    const doc = projectDoc(input);
    if (useFirebase()) {
      assertFirebase();
      await db.collection(COLLECTION).doc(id).set(doc);
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
    const project = await this.get(id);
    if (!project) throw notFound("Project");
    return project;
  },

  async update(id, patch) {
    if (useFirebase()) {
      assertFirebase();
      const ref = db.collection(COLLECTION).doc(id);
      const snap = await ref.get();
      if (!snap.exists) throw notFound("Project");
      await ref.update({ ...patch, _updatedAt: new Date().toISOString() });
      const updated = await ref.get();
      return fromFirestore(updated);
    }
    const updated = await inMemory().update(id, patch);
    if (!updated) throw notFound("Project");
    return updated;
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

  async listByUser(userId) {
    if (useFirebase()) {
      assertFirebase();
      const snap = await db
        .collection(COLLECTION)
        .where("userId", "==", userId)
        .get();
      return snap.docs.map(fromFirestore);
    }
    return (await inMemory().where("userId", "==", userId)).sort(
      (a, b) => (b._createdAt || "").localeCompare(a._createdAt || "")
    );
  },

  /**
   * Returns the project only if the requesting user owns it.
   * Throws 403 when the project belongs to someone else.
   */
  async getForUser(id, userId) {
    const project = await this.getOrThrow(id);
    if (project.userId && userId && project.userId !== userId) {
      const err = new Error("Forbidden");
      err.status = 403;
      err.code = "FORBIDDEN";
      throw err;
    }
    return project;
  },
};

export const VALID_ROLES = ROLES;
