import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { getNotes, getPhotoSignedUrl, type Note } from "@/lib/notes";
import { Images, Loader2 } from "lucide-react";
import EmptyState from "@/components/EmptyState";

interface PhotoItem {
  path: string;
  url: string;
  noteId: string;
  noteTitle: string;
}

const Photos = () => {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const notes: Note[] = await getNotes();
        const items: PhotoItem[] = [];
        for (const note of notes) {
          if (!note.photos?.length) continue;
          for (const path of note.photos) {
            try {
              const url = await getPhotoSignedUrl(path);
              items.push({ path, url, noteId: note.id, noteTitle: note.title || "Untitled" });
            } catch {
              /* skip */
            }
          }
        }
        setPhotos(items);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="mb-6 flex items-center gap-2">
          <Images className="h-6 w-6 text-primary" />
          <h1 className="font-heading text-3xl font-bold">My Photos</h1>
        </div>
        <p className="mb-6 text-sm text-muted-foreground">
          All photos attached to your notes, in one private place.
        </p>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : photos.length === 0 ? (
          <EmptyState
            title="No photos yet"
            description="Add photos when creating or editing a note. They'll appear here."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {photos.map((p, i) => (
              <Link
                key={`${p.noteId}-${p.path}-${i}`}
                to={`/edit/${p.noteId}`}
                className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                title={p.noteTitle}
              >
                <img
                  src={p.url}
                  alt={p.noteTitle}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  loading="lazy"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-xs font-medium text-white">{p.noteTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Photos;
