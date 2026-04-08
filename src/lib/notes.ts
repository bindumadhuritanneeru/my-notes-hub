// Types and localStorage utilities for notes management

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "notes-app-data";

/** Generate a unique ID */
const generateId = (): string =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

/** Load all notes from localStorage */
export const getNotes = (): Note[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

/** Save notes array to localStorage */
const saveNotes = (notes: Note[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

/** Create a new note */
export const createNote = (title: string, content: string): Note => {
  const notes = getNotes();
  const now = new Date().toISOString();
  const note: Note = { id: generateId(), title, content, createdAt: now, updatedAt: now };
  notes.unshift(note);
  saveNotes(notes);
  return note;
};

/** Update an existing note */
export const updateNote = (id: string, title: string, content: string): Note | null => {
  const notes = getNotes();
  const idx = notes.findIndex((n) => n.id === id);
  if (idx === -1) return null;
  notes[idx] = { ...notes[idx], title, content, updatedAt: new Date().toISOString() };
  saveNotes(notes);
  return notes[idx];
};

/** Delete a note by ID */
export const deleteNote = (id: string): boolean => {
  const notes = getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  if (filtered.length === notes.length) return false;
  saveNotes(filtered);
  return true;
};

/** Get a single note by ID */
export const getNoteById = (id: string): Note | null => {
  return getNotes().find((n) => n.id === id) || null;
};

/** Search notes by title or content */
export const searchNotes = (query: string): Note[] => {
  const q = query.toLowerCase();
  return getNotes().filter(
    (n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
  );
};

/** Sort notes */
export type SortField = "title" | "createdAt" | "updatedAt";
export type SortOrder = "asc" | "desc";

export const sortNotes = (notes: Note[], field: SortField, order: SortOrder): Note[] => {
  return [...notes].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];
    const cmp = valA.localeCompare(valB);
    return order === "asc" ? cmp : -cmp;
  });
};
