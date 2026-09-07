/**
 * In-memory data store.
 *
 * Each "collection" is a Map keyed by document id. Documents
 * are plain JS objects with an `_id`, `_createdAt`, `_updatedAt`.
 *
 * This is the default storage backend (STORAGE=memory). It is
 * NOT persistent across restarts; the trade-off is zero infra
 * dependencies, perfect for local dev, smoke tests, and CI.
 *
 * The interface mirrors the small subset of Firestore that the
 * app actually uses, so swapping in the Firebase repository
 * requires no controller changes.
 */
import { logger } from "../config/logger.js";

const now = () => new Date().toISOString();

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = new Map();
  }

  _stamp(doc, isCreate) {
    const ts = now();
    if (isCreate) {
      doc._createdAt = doc._createdAt || ts;
    }
    doc._updatedAt = ts;
    return doc;
  }

  async create(id, data) {
    if (this.docs.has(id)) {
      const err = new Error(`Duplicate id in ${this.name}: ${id}`);
      err.code = "DUPLICATE";
      throw err;
    }
    const doc = this._stamp({ _id: id, ...data }, true);
    this.docs.set(id, doc);
    return doc;
  }

  async set(id, data, { merge = false } = {}) {
    if (merge && this.docs.has(id)) {
      const existing = this.docs.get(id);
      const merged = { ...existing, ...data, _id: id };
      this._stamp(merged, false);
      this.docs.set(id, merged);
      return merged;
    }
    return this.create(id, data);
  }

  async get(id) {
    return this.docs.get(id) || null;
  }

  async update(id, patch) {
    const existing = this.docs.get(id);
    if (!existing) return null;
    const merged = { ...existing, ...patch, _id: id };
    this._stamp(merged, false);
    this.docs.set(id, merged);
    return merged;
  }

  async delete(id) {
    return this.docs.delete(id);
  }

  async list() {
    return [...this.docs.values()];
  }

  async where(field, op, value) {
    const all = [...this.docs.values()];
    const match = (doc) => {
      const v = field.split(".").reduce((acc, k) => (acc == null ? acc : acc[k]), doc);
      switch (op) {
        case "==":
          return v === value;
        case "!=":
          return v !== value;
        case ">":
          return v > value;
        case "<":
          return v < value;
        case "in":
          return Array.isArray(value) && value.includes(v);
        default:
          return false;
      }
    };
    return all.filter(match);
  }

  async clear() {
    this.docs.clear();
  }
}

class MemoryStore {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MemoryCollection(name));
    }
    return this.collections.get(name);
  }

  async clear() {
    for (const c of this.collections.values()) await c.clear();
  }

  stats() {
    const out = {};
    for (const [name, c] of this.collections) {
      out[name] = c.docs.size;
    }
    return out;
  }
}

let _instance = null;

export const getStore = () => {
  if (!_instance) {
    _instance = new MemoryStore();
    logger.info("in-memory store initialized");
  }
  return _instance;
};

export const resetStore = async () => {
  if (_instance) await _instance.clear();
};
