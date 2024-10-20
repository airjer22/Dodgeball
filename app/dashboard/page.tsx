"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { UserProfile } from '@/components/user-profile';
import { TournamentList } from '@/components/tournament-list';
import { CreateTournamentForm } from '@/components/create-tournament-form';
import { useTournament } from '@/contexts/TournamentContext';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const [tournaments, setTournaments] = useState([
    { id: 1, name: 'Summer Dodgeball Classic 2025', teams: 8, rounds: 3, date: 'June 15-17, 2025' },
    { id: 2, name: 'Corporate Challenge 2025', teams: 12, rounds: 4, date: 'August 22-24, 2025' },
    { id: 3, name: 'Winter Dodgeball Cup 2025', teams: 16, rounds: 5, date: 'December 10-12, 2025' },
  ]);

  const { selectedTournament, setSelectedTournament } = useTournament();
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const addTournament = (newTournament) => {
    const tournamentWithId = { id: Date.now(), ...newTournament };
    setTournaments([tournamentWithId, ...tournaments]);
    setSelectedTournament(tournamentWithId);
  };

  const deleteTournament = (id) => {
    setTournaments(tournaments.filter(tournament => tournament.id !== id));
    if (selectedTournament && selectedTournament.id === id) {
      setSelectedTournament(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <UserProfile user={user} />
          <TournamentList 
            tournaments={tournaments} 
            onDeleteTournament={deleteTournament}
            onSelectTournament={setSelectedTournament}
            selectedTournament={selectedTournament}
          />
          <CreateTournamentForm onCreateTournament={addTournament} />
        </div>
      </main>
    </div>
  );
}