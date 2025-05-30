import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "../hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function AuthModals() {
  const { 
    isLoginModalOpen, 
    isSignupModalOpen, 
    closeLoginModal, 
    closeSignupModal,
    openSignupModal,
    openLoginModal,
    login,
    signup
  } = useAuth();
  
  const { toast } = useToast();
  
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) return;

    setIsLoading(true);
    try {
      const success = await login(loginForm.email, loginForm.password);
      if (success) {
        closeLoginModal();
        setLoginForm({ email: "", password: "" });
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in.",
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupForm.name || !signupForm.email || !signupForm.password) return;

    setIsLoading(true);
    try {
      const success = await signup(signupForm.name, signupForm.email, signupForm.password);
      if (success) {
        closeSignupModal();
        setSignupForm({ name: "", email: "", password: "" });
        toast({
          title: "Welcome to WriteSpace!",
          description: "Your account has been created successfully.",
        });
      } else {
        toast({
          title: "Signup failed",
          description: "An account with this email already exists.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const switchToSignup = () => {
    closeLoginModal();
    openSignupModal();
  };

  const switchToLogin = () => {
    closeSignupModal();
    openLoginModal();
  };

  return (
    <>
      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={closeLoginModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome Back</DialogTitle>
            <DialogDescription>
              Sign in to your WriteSpace account to continue writing.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter your password"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={switchToSignup}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign up here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupModalOpen} onOpenChange={closeSignupModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Join WriteSpace</DialogTitle>
            <DialogDescription>
              Create your account to start sharing your stories with the world.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                type="text"
                value={signupForm.name}
                onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={signupForm.password}
                onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                type="button"
                onClick={switchToLogin}
                className="text-primary hover:underline font-medium"
                disabled={isLoading}
              >
                Sign in here
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
