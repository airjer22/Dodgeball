"use client"

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, Calendar, GitBranch, Moon, Sun, LogOut, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Trophy } from 'lucide-react';
import { useTheme } from "next-themes"
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function Sidebar({ tournamentId }) {
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const { user } = useAuth();
  const pathname = usePathname();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }

  const isActive = (path) => {
    return pathname.includes(path);
  };

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground h-full shadow-lg flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <Trophy className="h-6 w-6 mr-2" />
        <span className="text-xl font-semibold">Dodgeball Manager</span>
      </div>
      <nav className="mt-6 flex-grow">
        <Link href="/dashboard" passHref>
          <Button
            variant={isActive('/dashboard') && !tournamentId ? 'secondary' : 'ghost'}
            className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          >
            <Home className="h-5 w-5 mr-3" />
            Home
          </Button>
        </Link>
        {tournamentId && (
          <>
            <Link href={`/dashboard/${tournamentId}`} passHref>
              <Button
                variant={isActive(`/dashboard/${tournamentId}`) && !isActive('/teams') && !isActive('/calendar') && !isActive('/bracket') ? 'secondary' : 'ghost'}
                className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <BarChart2 className="h-5 w-5 mr-3" />
                Standings
              </Button>
            </Link>
            <Link href={`/dashboard/${tournamentId}/teams`} passHref>
              <Button
                variant={isActive('/teams') ? 'secondary' : 'ghost'}
                className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Users className="h-5 w-5 mr-3" />
                Teams
              </Button>
            </Link>
            <Link href={`/dashboard/${tournamentId}/calendar`} passHref>
              <Button
                variant={isActive('/calendar') ? 'secondary' : 'ghost'}
                className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <Calendar className="h-5 w-5 mr-3" />
                Calendar
              </Button>
            </Link>
            <Link href={`/dashboard/${tournamentId}/bracket`} passHref>
              <Button
                variant={isActive('/bracket') ? 'secondary' : 'ghost'}
                className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <GitBranch className="h-5 w-5 mr-3" />
                Bracket
              </Button>
            </Link>
          </>
        )}
      </nav>
      <div className="mt-auto px-6 py-3">
        <Button 
          variant="ghost" 
          className="flex items-center justify-start w-full py-3 px-0"
          onClick={toggleTheme}
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5 mr-3" />
          ) : (
            <Moon className="h-5 w-5 mr-3" />
          )}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        {user && (
          <Button 
            variant="ghost" 
            className="flex items-center justify-start w-full py-3 px-0 text-red-500 hover:bg-red-100 hover:text-red-600 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}