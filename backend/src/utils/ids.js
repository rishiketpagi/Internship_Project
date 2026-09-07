/**
 * Project-wide ID helpers. Wrapping uuid generation here makes
 * it trivial to swap providers later (e.g. nanoid, ULID, k-sortable)
 * without touching the call sites.
 */
import { v4 as uuidv4 } from "uuid";

export const newId = (prefix) => (prefix ? `${prefix}_${uuidv4()}` : uuidv4());

export const projectId = () => newId("proj");
export const versionId = () => newId("ver");
export const blueprintId = () => newId("bp");
export const generatedId = () => newId("gen");
export const exportJobId = () => newId("exp");
export const interviewId = () => newId("int");
export const githubId = () => newId("gh");
