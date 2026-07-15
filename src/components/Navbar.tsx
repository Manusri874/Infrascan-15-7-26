import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, Scan, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home",      path: "/" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Detect",    path: "/detect" },
  { label: "Analytics", path: "/analytics" },
  { label: "Routes",    path: "/routes" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user, signOut, loading } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex items-center justify-center w-8 h-8">
            <Scan className="w-7 h-7 text-primary animate-pulse-cyan" />
          </div>
          <span className="font-mono font-bold text-lg tracking-widest text-foreground">
            INFRA<span className="text-primary">SCAN</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                pathname === path
                  ? "text-primary bg-primary/10 border border-primary/30"
                  : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth CTA */}
        <div className="hidden md:flex items-center gap-3">
          {!loading && (
            user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-surface-1 text-sm text-muted-foreground">
                  <User className="w-3.5 h-3.5 text-primary" />
                  <span className="max-w-[120px] truncate text-xs font-mono">{user.email}</span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity glow-cyan"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-surface-1 px-4 py-4 flex flex-col gap-2">
          {navItems.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setOpen(false)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                pathname === path
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground"
              }`}
            >
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-1">
            {user ? (
              <button
                onClick={() => { handleSignOut(); setOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md bg-primary text-primary-foreground"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
