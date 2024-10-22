"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { useTheme } from "next-themes"

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const router = useRouter();
  const { theme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setNotification({ message: 'Login Successful', type: 'success' });
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (error) {
      setNotification({ message: 'Invalid email or password. Please try again.', type: 'error' });
    }
  };

  const handleGuestAccess = () => {
    router.push('/guest');
  };

  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <Card className="w-[350px] glassmorphism">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl flex items-center justify-center">
            <Trophy className="mr-2 h-6 w-6 text-primary" />
            <span className="gradient-text">3 Pin Dodgeball</span>
          </CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {notification.message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-2 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'}`}
            >
              {notification.message}
            </motion.div>
          )}
          <motion.div className="grid gap-2" variants={inputVariants}>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>
          <motion.div className="grid gap-2" variants={inputVariants}>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button className="w-full hover-scale" onClick={handleLogin}>Login</Button>
          <Button variant="outline" className="w-full hover-scale" onClick={handleGuestAccess}>
            Continue as Guest
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}