import { Link, useLocation } from "react-router-dom";
import { StickyNote, Plus, Home, LogOut, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/notes", label: "My Notes", icon: StickyNote },
  { to: "/create", label: "New Note", icon: Plus },
];

const openChat = () => window.dispatchEvent(new CustomEvent("notely:open-chat"));

const Navbar = () => {
  const { pathname } = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-primary">
          <StickyNote className="h-6 w-6" />
          Notely
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          <button
            onClick={openChat}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            title="Ask Notely AI any question"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline">Ask AI</span>
          </button>
          {user && (
            <Button variant="ghost" size="sm" onClick={signOut} className="ml-2 text-muted-foreground">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Logout</span>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
