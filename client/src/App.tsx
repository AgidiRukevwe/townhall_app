import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import OfficialsDebug from "./pages/officials-debug";
import Navbar from "./components/layout/navbar";
import { AuthProvider } from "./hooks/use-auth.tsx";
import { ProtectedRoute } from "./lib/protected-route";
import AuthPageUpdated from "./pages/auth-page-updated";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {children}
    </div>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPageUpdated} />
      <ProtectedRoute 
        path="/" 
        component={() => (
          <ProtectedLayout>
            <Home />
          </ProtectedLayout>
        )} 
      />
      <ProtectedRoute 
        path="/profile/:id" 
        component={({ params }) => (
          <ProtectedLayout>
            <Profile id={params.id} />
          </ProtectedLayout>
        )} 
      />
      <ProtectedRoute 
        path="/debug-officials" 
        component={() => (
          <ProtectedLayout>
            <OfficialsDebug />
          </ProtectedLayout>
        )} 
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Router />
      </AuthProvider>
    </TooltipProvider>
  );
}

export default App;
