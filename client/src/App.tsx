import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "./pages/home";
import Profile from "./pages/profile";
import OfficialsDebug from "./pages/officials-debug";
import { Navbar } from "./components/layout/navbar";
// import { AuthProvider } from "./hooks/use-auth.tsx";
import { ProtectedRoute } from "./lib/protected-route";
// import LoginPage from "./pages/login-page";
// import RegisterPage from "./pages/register-page";
import { BrowserRouter } from "react-router-dom";
import OfficialsCategoryPage from "./pages/officials-by-category.tsx";
import SearchPage from "./pages/search-page.tsx";
import TestPage from "./pages/testPage.tsx";
import { useEffect } from "react";
import { useAuthStore } from "./store/auth-store.ts";
import { useGoogleAuth } from "./hooks/auth-hooks/use-google-auth.ts";

if (process.env.NODE_ENV === "production") {
  console.log = () => {};
  console.warn = () => {};
  console.info = () => {};
  console.debug = () => {};
}

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  // We don't need to pass props here since the Navbar in Home will handle search/user functionality
  return <div className="flex flex-col min-h-screen">{children}</div>;
};

function Router() {
  return (
    <Switch>
      {/* <Route path="/auth" component={LoginPage} /> */}
      {/* <Route path="/register" component={RegisterPage} /> */}
      <Route path="/test" component={TestPage} />
      <Route path="/">
        <Home />
      </Route>
      <Route path="/profile/:id">
        {(params) => (
          <ProtectedLayout>
            <Profile />
          </ProtectedLayout>
        )}
      </Route>
      <Route path="/officials/:category">
        {/* <ProtectedLayout>
          <OfficialsCategoryPage />
        </ProtectedLayout> */}
      </Route>
      <Route path="/search">
        <ProtectedLayout>
          <SearchPage />
        </ProtectedLayout>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <TooltipProvider>
      {/* <AuthProvider> */}
      <Toaster />
      <Router />
      {/* </AuthProvider> */}
    </TooltipProvider>
  );
}

export default App;
