"use client"

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Home, Users, Calendar, Moon, Sun, LogOut, BarChart2 } from 'lucide-react';
import { Button } from "'components/ui/button"'
import { Trophy } from 'lucide-react';
import { useTheme } from "next-themes"
import { useAuth } from ''contexts/AuthContext'';
import { signOut } from 'firebase/auth';
import { auth } from ''lib/firebase'';
import { motion } from 'framer-motion';

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

  const sidebarVariants = {
    hidden: { x: -300 },
    visible: { x: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div
      className="w-64 bg-background border-r border-border h-full shadow-lg flex flex-col"
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
    >
      <div className="flex items-center justify-center h-16 border-b border-border">
        <Trophy className="h-6 w-6 mr-2 text-primary" />
        <span className="text-xl font-semibold gradient-text">Dodgeball Manager</span>
      </div>
      <nav className="mt-6 flex-grow">
        <motion.div variants={linkVariants}>
          <Link href="/dashboard" passHref>
            <Button
              variant={isActive('/dashboard') && !tournamentId ? 'secondary' : 'ghost'}
              className="w-full justify-start px-6 py-3 mb-2 hover:bg-primary/10"
            >
              <Home className="h-5 w-5 mr-3" />
              Home
            </Button>
          </Link>
        </motion.div>
        {tournamentId && (
          <>
            <motion.div variants={linkVariants}>
              <Link href={`/dashboard/${tournamentId}`} passHref>
                <Button
                  variant={isActive(`/dashboard/${tournamentId}`) && !isActive('/teams') && !isActive('/calendar') ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-6 py-3 mb-2 hover:bg-primary/10"
                >
                  <BarChart2 className="h-5 w-5 mr-3" />
                  Standings
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link href={`/dashboard/${tournamentId}/teams`} passHref>
                <Button
                  variant={isActive('/teams') ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-6 py-3 mb-2 hover:bg-primary/10"
                >
                  <Users className="h-5 w-5 mr-3" />
                  Teams
                </Button>
              </Link>
            </motion.div>
            <motion.div variants={linkVariants}>
              <Link href={`/dashboard/${tournamentId}/calendar`} passHref>
                <Button
                  variant={isActive('/calendar') ? 'secondary' : 'ghost'}
                  className="w-full justify-start px-6 py-3 mb-2 hover:bg-primary/10"
                >
                  <Calendar className="h-5 w-5 mr-3" />
                  Calendar
                </Button>
              </Link>
            </motion.div>
          </>
        )}
      </nav>
      <div className="mt-auto px-6 py-3">
        <Button 
          variant="ghost" 
          className="flex items-center justify-start w-full py-3 px-0 hover:bg-primary/10"
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
            className="flex items-center justify-start w-full py-3 px-0 text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </Button>
        )}
      </div>
    </motion.div>
  );
}
