import { supabase } from "@/integrations/supabase/client";

export interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
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
  return data || [];
};

/** Get a single note by ID */
export const getNoteById = async (id: string): Promise<Note | null> => {
  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
};

/** Create a new note */
export const createNote = async (title: string, content: string): Promise<Note> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("notes")
    .insert({ title, content, user_id: user.id })
    .select()
    .single();
  if (error) throw error;

  // Log activity
  await logActivity("create_note", { note_id: data.id, title });
  return data;
};

/** Update a note */
export const updateNote = async (id: string, title: string, content: string): Promise<Note> => {
  const { data, error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  await logActivity("update_note", { note_id: id, title });
  return data;
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
  return data || [];
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

/** Log user activity */
export const logActivity = async (action: string, details: Record<string, any> = {}) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("user_activities").insert({
    user_id: user.id,
    action,
    details,
  });
};
