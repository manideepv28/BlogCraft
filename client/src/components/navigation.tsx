import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Menu, User, LogOut, FileText, Plus } from "lucide-react";
import { useAuth } from "../hooks/use-auth";

export default function Navigation() {
  const [location, setLocation] = useLocation();
  const { user, logout, openLoginModal, openSignupModal } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleWriteClick = () => {
    if (user) {
      setLocation("/write");
    } else {
      openLoginModal();
    }
  };

  const handleDashboardClick = () => {
    if (user) {
      setLocation("/dashboard");
    } else {
      openLoginModal();
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-primary">WriteSpace</h1>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/" className={`font-medium transition-colors ${
                isActive("/") 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}>
                Home
              </Link>
              
              {user && (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className={`font-medium transition-colors ${
                      isActive("/dashboard") 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dashboard
                  </button>
                  
                  <button
                    onClick={() => setLocation("/write")}
                    className={`font-medium transition-colors ${
                      isActive("/write") 
                        ? "text-foreground" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Write
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Search and Auth */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search posts..."
                className="w-64 pl-10"
              />
            </div>

            {/* User Actions */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Button onClick={handleWriteClick} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Write
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleDashboardClick}>
                      <FileText className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={openLoginModal}>
                  Sign In
                </Button>
                <Button onClick={openSignupModal}>
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              className="w-full pl-10"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-card">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground">
                Home
              </Link>
              
              {user ? (
                <>
                  <button
                    onClick={handleDashboardClick}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => setLocation("/write")}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                  >
                    Write
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={openLoginModal}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={openSignupModal}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
