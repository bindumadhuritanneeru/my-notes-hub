import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createNote } from "@/lib/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const CreateNote = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in both title and content.");
      return;
    }
    setSaving(true);
    try {
      await createNote(title.trim(), content.trim());
      toast.success("Note created!");
      navigate("/notes");
    } catch {
      toast.error("Failed to create note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <h1 className="mb-6 font-heading text-3xl font-bold">Create Note</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">Title</label>
            <Input id="title" placeholder="Note title…" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
          </div>
          <div>
            <label htmlFor="content" className="mb-1.5 block text-sm font-medium">Content</label>
            <Textarea id="content" placeholder="Write your note here…" rows={8} value={content} onChange={(e) => setContent(e.target.value)} />
          </div>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Saving…
              </span>
            ) : (
              <><Save className="mr-2 h-4 w-4" />Save Note</>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateNote;
