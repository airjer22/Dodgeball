"use client"

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { GuestDashboard } from '@/components/guest-dashboard';
import { TournamentSelector } from '@/components/tournament-selector';
import { getAllTournaments } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";

export default function GuestPage() {
  const router = useRouter();
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournaments, setTournaments] = useState([]);
  const { toast } = useToast();

  const fetchTournaments = useCallback(async () => {
    try {
      const fetchedTournaments = await getAllTournaments();
      setTournaments(fetchedTournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast({
        title: "Error",
        description: "Failed to fetch tournaments. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleLogout = () => {
    router.push('/');
  };

  const handleBack = () => {
    setSelectedTournament(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">3 Pin Dodgeball Tournament</h1>
          <Button onClick={handleLogout}>Log Out</Button>
        </div>
        {!selectedTournament ? (
          <TournamentSelector tournaments={tournaments} onSelect={setSelectedTournament} />
        ) : (
          <GuestDashboard tournament={selectedTournament} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}