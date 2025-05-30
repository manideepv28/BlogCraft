import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./lib/auth";

import Navigation from "./components/navigation";
import AuthModals from "./components/auth-modals";
import Home from "./pages/home";
import Dashboard from "./pages/dashboard";
import Write from "./pages/write";
import PostDetail from "./pages/post-detail";
import NotFound from "./pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/write" component={Write} />
      <Route path="/write/:id" component={Write} />
      <Route path="/post/:id" component={PostDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Router />
            </main>
            <AuthModals />
            <Toaster />
          </div>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
