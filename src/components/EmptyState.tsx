import { StickyNote, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const EmptyState = ({ message = "No notes yet" }: { message?: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="mb-4 rounded-full bg-muted p-4">
      <StickyNote className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="mb-1 font-heading text-lg font-semibold">{message}</h3>
    <p className="mb-6 text-sm text-muted-foreground">Create your first note to get started.</p>
    <Button asChild>
      <Link to="/create">
        <Plus className="mr-2 h-4 w-4" />
        Create Note
      </Link>
    </Button>
  </div>
);

export default EmptyState;
