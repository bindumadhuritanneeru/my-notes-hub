import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Eye, StickyNote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNotes } from "@/lib/notes";

const Index = () => {
  const count = getNotes().length;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg text-center"
      >
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
          <StickyNote className="h-10 w-10 text-primary" />
        </div>

        <h1 className="mb-3 font-heading text-4xl font-bold tracking-tight sm:text-5xl">
          Welcome to <span className="text-primary">Notely</span>
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          A simple, beautiful notes app. Create, organize, and manage your thoughts in one place.
        </p>

        {/* Stats pill */}
        <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground">
          <StickyNote className="h-4 w-4" />
          {count} {count === 1 ? "note" : "notes"} saved
        </div>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Note
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/notes">
              <Eye className="mr-2 h-5 w-5" />
              View Notes
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Index;
