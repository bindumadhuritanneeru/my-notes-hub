import { useState, useRef, useEffect } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadNotePhoto, getPhotoSignedUrl, deleteNotePhoto } from "@/lib/notes";
import { toast } from "sonner";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
}

const PhotoUpload = ({ photos, onChange }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const inputRef = useRef<HTMLInputElement>(null);

  // Resolve signed URLs for previews whenever photo paths change
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const next: Record<string, string> = {};
      await Promise.all(
        photos.map(async (path) => {
          try {
            next[path] = await getPhotoSignedUrl(path);
          } catch {
            // ignore
          }
        })
      );
      if (!cancelled) setPreviews(next);
    })();
    return () => { cancelled = true; };
  }, [photos]);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        if (file.size > 10 * 1024 * 1024) {
          toast.error(`${file.name} is larger than 10MB`);
          continue;
        }
        const path = await uploadNotePhoto(file);
        uploaded.push(path);
      }
      if (uploaded.length) {
        onChange([...photos, ...uploaded]);
        toast.success(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded`);
      }
    } catch (e: any) {
      toast.error(e.message || "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removePhoto = async (path: string) => {
    onChange(photos.filter((p) => p !== path));
    try { await deleteNotePhoto(path); } catch { /* ignore */ }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <Button
        type="button"
        variant="outline"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading…</>
        ) : (
          <><ImagePlus className="mr-2 h-4 w-4" />Add Photos</>
        )}
      </Button>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {photos.map((path) => (
            <div key={path} className="group relative aspect-square overflow-hidden rounded-lg border bg-muted">
              {previews[path] ? (
                <img src={previews[path]} alt="Note attachment" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              )}
              <button
                type="button"
                onClick={() => removePhoto(path)}
                className="absolute right-1 top-1 rounded-full bg-background/90 p-1 opacity-0 shadow transition-opacity group-hover:opacity-100"
                aria-label="Remove photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
