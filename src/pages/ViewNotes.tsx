import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUpDown } from "lucide-react";
import { getNotes, deleteNote, searchNotes, sortNotes, Note, SortField, SortOrder } from "@/lib/notes";
import NoteCard from "@/components/NoteCard";
import DeleteConfirmDialog from "@/components/DeleteConfirmDialog";
import EmptyState from "@/components/EmptyState";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const ViewNotes = () => {
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [, setTick] = useState(0); // force re-render after delete

  const notes = useMemo(() => {
    const base = query.trim() ? searchNotes(query) : getNotes();
    return sortNotes(base, sortField, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, sortField, sortOrder, noteToDelete]);

  const handleConfirmDelete = () => {
    if (!noteToDelete) return;
    deleteNote(noteToDelete.id);
    toast.success(`"${noteToDelete.title}" deleted.`);
    setNoteToDelete(null);
    setTick((t) => t + 1);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="mb-6 font-heading text-3xl font-bold">Your Notes</h1>

        {/* Search & Sort controls */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notes…"
              className="pl-9"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
              <SelectTrigger className="w-[140px]">
                <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Date Created</SelectItem>
                <SelectItem value="updatedAt">Last Updated</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as SortOrder)}>
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest</SelectItem>
                <SelectItem value="asc">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Notes grid */}
        {notes.length === 0 ? (
          <EmptyState message={query ? "No notes match your search" : "No notes yet"} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {notes.map((note, i) => (
                <NoteCard key={note.id} note={note} index={i} onDeleteClick={setNoteToDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        open={!!noteToDelete}
        noteTitle={noteToDelete?.title || ""}
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoteToDelete(null)}
      />
    </div>
  );
};

export default ViewNotes;
