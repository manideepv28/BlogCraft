import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User, InsertUser } from "@shared/schema";

interface AuthContextType {
  user: User | null;
  isLoginModalOpen: boolean;
  isSignupModalOpen: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openSignupModal: () => void;
  closeSignupModal: () => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("writeSpace_currentUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("writeSpace_currentUser");
      }
    }
  }, []);

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const openSignupModal = () => setIsSignupModalOpen(true);
  const closeSignupModal = () => setIsSignupModalOpen(false);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("writeSpace_users") || "[]");
      const foundUser = users.find((u: User) => u.email === email && u.password === password);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("writeSpace_currentUser", JSON.stringify(foundUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem("writeSpace_users") || "[]");
      
      // Check if user already exists
      if (users.find((u: User) => u.email === email)) {
        return false;
      }

      const newUser: User = {
        id: Date.now(),
        name,
        email,
        password,
        createdAt: new Date(),
      };

      users.push(newUser);
      localStorage.setItem("writeSpace_users", JSON.stringify(users));
      
      setUser(newUser);
      localStorage.setItem("writeSpace_currentUser", JSON.stringify(newUser));
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("writeSpace_currentUser");
  };

  const value = {
    user,
    isLoginModalOpen,
    isSignupModalOpen,
    openLoginModal,
    closeLoginModal,
    openSignupModal,
    closeSignupModal,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
