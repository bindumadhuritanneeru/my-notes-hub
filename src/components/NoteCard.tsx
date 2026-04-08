import { motion } from "framer-motion";
import { Trash2, Pencil, Clock } from "lucide-react";
import { Note } from "@/lib/notes";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface NoteCardProps {
  note: Note;
  index: number;
  onDeleteClick: (note: Note) => void;
}

const NoteCard = ({ note, index, onDeleteClick }: NoteCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group relative rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Title */}
      <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground line-clamp-1">
        {note.title}
      </h3>

      {/* Content preview */}
      <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{note.content}</p>

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {format(new Date(note.createdAt), "MMM d, yyyy 'at' h:mm a")}
      </div>

      {/* Action buttons — visible on hover */}
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Link
          to={`/edit/${note.id}`}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Pencil className="h-4 w-4" />
        </Link>
        <button
          onClick={() => onDeleteClick(note)}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;
