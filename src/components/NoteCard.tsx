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
      {note.photos && note.photos.length > 0 && (
        <div className="mb-3 -mx-1 grid grid-cols-3 gap-1">
          {note.photos.slice(0, 3).map((url, i) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
              {i === 2 && note.photos.length > 3 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white">
                  +{note.photos.length - 3}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <h3 className="mb-2 font-heading text-lg font-semibold text-card-foreground line-clamp-1">
        {note.title}
      </h3>
      <p className="mb-4 text-sm text-muted-foreground line-clamp-3">{note.content}</p>
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <Clock className="h-3 w-3" />
        {format(new Date(note.created_at), "MMM d, yyyy 'at' h:mm a")}
      </div>
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Link to={`/edit/${note.id}`} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Pencil className="h-4 w-4" />
        </Link>
        <button onClick={() => onDeleteClick(note)} className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;
