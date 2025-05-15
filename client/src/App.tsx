import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import LoginPage from "./pages/login-page";
import RegisterPage from "./pages/register-page";
import Navbar from "./components/layout/navbar";
import { AuthProvider } from "./hooks/use-auth.tsx";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Switch>
        <ProtectedRoute path="/" component={Home} />
        <ProtectedRoute path="/profile/:id" component={Profile} />
        <Route path="/login" component={LoginPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/auth">
          <div className="flex flex-col items-center justify-center min-h-screen bg-background">
            <LoginPage />
          </div>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
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
