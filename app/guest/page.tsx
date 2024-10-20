"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { GuestDashboard } from '@/components/guest-dashboard';
import { TournamentSelector } from '@/components/tournament-selector';
import { getAllTournaments } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function GuestPage() {
  const router = useRouter();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTournaments = await getAllTournaments();
      setTournaments(fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      setError("Failed to fetch tournaments. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch tournaments. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedTournament(null);
  };

  const handleBackToLogin = () => {
    router.push('/');
  };

  if (loading) {
    return <div>Loading tournaments...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">3 Pin Dodgeball Tournament</h1>
          <Button onClick={handleBackToLogin}>Back to Login</Button>
        </div>
        {!selectedTournament ? (
          tournaments.length === 0 ? (
            <div>No tournaments available at the moment. Please check back later.</div>
          ) : (
            <TournamentSelector tournaments={tournaments} onSelect={setSelectedTournament} />
          )
        ) : (
          <GuestDashboard tournament={selectedTournament} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}