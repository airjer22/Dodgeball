"use client"

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Users, Calendar, GitBranch, Moon, Sun, LogOut, BarChart2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Trophy } from 'lucide-react';
import { useTheme } from "next-themes"
import { useTournament } from '@/contexts/TournamentContext';
import { useAuth } from '@/contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export function Sidebar() {
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const { selectedTournament } = useTournament();
  const { user } = useAuth();

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

  const isDisabled = !selectedTournament;

  return (
    <div className="w-64 bg-sidebar text-sidebar-foreground h-full shadow-lg flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-sidebar-border">
        <Trophy className="h-6 w-6 mr-2" />
        <span className="text-xl font-semibold">Dodgeball Master</span>
      </div>
      <nav className="mt-6 flex-grow">
        <Link href="/dashboard" className="flex items-center px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors">
          <Home className="h-5 w-5 mr-3" />
          Home
        </Link>
        <Button
          disabled={isDisabled}
          variant="ghost"
          className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          onClick={() => router.push('/standings')}
        >
          <BarChart2 className="h-5 w-5 mr-3" />
          Standings
        </Button>
        <Button
          disabled={isDisabled}
          variant="ghost"
          className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          onClick={() => router.push('/teams')}
        >
          <Users className="h-5 w-5 mr-3" />
          Teams
        </Button>
        <Button
          disabled={isDisabled}
          variant="ghost"
          className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          onClick={() => router.push('/calendar')}
        >
          <Calendar className="h-5 w-5 mr-3" />
          Calendar
        </Button>
        <Button
          disabled={isDisabled}
          variant="ghost"
          className="w-full justify-start px-6 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
          onClick={() => router.push('/bracket')}
        >
          <GitBranch className="h-5 w-5 mr-3" />
          Bracket
        </Button>
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