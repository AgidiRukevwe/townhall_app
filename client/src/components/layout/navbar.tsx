import { Link, useLocation } from "wouter";
import { SearchBar } from "./search-bar";
import { LogOut, LogIn, Menu, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "../../hooks/use-auth.tsx";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const userInitial = user ? user.username.charAt(0).toUpperCase() : 'G';

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            TOWNHALL
          </Link>
        </div>
        
        <div className="flex-1 max-w-md mx-4 hidden md:block">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="block md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="py-4">
                  <Link href="/" className="text-xl font-bold text-gray-900 block mb-6">
                    TOWNHALL
                  </Link>
                  <div className="mb-6">
                    <SearchBar />
                  </div>
                  <nav className="flex flex-col gap-2">
                    <Link href="/" className="py-2 px-3 rounded-md hover:bg-gray-100">
                      Home
                    </Link>
                    <Link href="/my-officials" className="py-2 px-3 rounded-md hover:bg-gray-100">
                      My Officials
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-200 text-gray-700">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isLoading ? (
                <DropdownMenuItem disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </DropdownMenuItem>
              ) : user ? (
                <>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>{user.username}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} disabled={logoutMutation.isPending}>
                    {logoutMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="mr-2 h-4 w-4" />
                    )}
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate("/auth")}>
                  <LogIn className="mr-2 h-4 w-4" />
                  <span>Login / Register</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
