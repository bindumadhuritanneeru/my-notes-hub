import { supabase } from "@/integrations/supabase/client";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  photos: string[];
}

// Keep old aliases for components that use camelCase
export type { Note as NoteType };

export type SortField = "title" | "created_at" | "updated_at";
export type SortOrder = "asc" | "desc";

/** Get all notes for the current user */
export const getNotes = async (): Promise<Note[]> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Note[];
};

/** Get a single note by ID */
export const getNoteById = async (id: string): Promise<Note | null> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data as Note | null;
};

/** Create a new note */
export const createNote = async (title: string, content: string, photos: string[] = []): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user.id, photos })
    .select()
    .single();
  if (error) throw error;

  await logActivity("create_note", { note_id: data.id, title });
  return data as Note;
};

/** Update a note */
export const updateNote = async (id: string, title: string, content: string, photos: string[] = []): Promise<Note> => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content, photos })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await logActivity("update_note", { note_id: id, title });
  return data as Note;
};

/** Delete a note */
export const deleteNote = async (id: string): Promise<void> => {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
  await logActivity("delete_note", { note_id: id });
};

/** Search notes */
export const searchNotes = async (query: string): Promise<Note[]> => {
  const q = `%${query}%`;
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .or(`title.ilike.${q},content.ilike.${q}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Note[];
};

/** Sort notes client-side */
export const sortNotes = (notes: Note[], field: SortField, order: SortOrder): Note[] => {
  return [...notes].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];
    const cmp = valA.localeCompare(valB);
    return order === "asc" ? cmp : -cmp;
  });
};

/** Upload a photo to storage and return its storage path */
export const uploadNotePhoto = async (file: File): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const ext = file.name.split(".").pop() || "jpg";
  const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage.from("note-photos").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  return path;
};

/** Generate a short-lived signed URL for a stored photo (owner-only) */
export const getPhotoSignedUrl = async (path: string, expiresIn = 3600): Promise<string> => {
  // Backwards compatibility: if an old public URL was stored, return it as-is
  if (path.startsWith("http")) return path;
  const { data, error } = await supabase.storage.from("note-photos").createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};

/** Delete a photo from storage */
export const deleteNotePhoto = async (path: string): Promise<void> => {
  if (path.startsWith("http")) return; // legacy URL, skip
  await supabase.storage.from("note-photos").remove([path]);
};

/** Allowed activity action names */
const ALLOWED_ACTIONS = new Set([
  "create_note",
  "update_note",
  "delete_note",
  "chat_message",
]);

/** Sanitize a value into a primitive safe for JSONB storage */
const sanitizeValue = (v: unknown): string | number | boolean | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" || typeof v === "boolean") return v;
  if (typeof v === "string") return v.slice(0, 500);
  return String(v).slice(0, 500);
};

/** Log user activity with validated/sanitized payload */
export const logActivity = async (action: string, details: Record<string, unknown> = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Validate action
  if (typeof action !== "string" || !ALLOWED_ACTIONS.has(action)) return;

  // Whitelist + sanitize details keys (max 10 keys, primitive values only)
  const allowedKeys = ["note_id", "title", "message"];
  const safeDetails: Record<string, string | number | boolean | null> = {};
  for (const key of allowedKeys) {
    if (key in details) safeDetails[key] = sanitizeValue(details[key]);
  }

  await supabase.from("user_activities").insert({
    user_id: user.id,
    action,
    details: safeDetails,
  });
};
