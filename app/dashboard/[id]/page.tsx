"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { getTournament, getTeamsByTournament, getMatchesByTournament } from '@/lib/firestore';
import { StandingsPage } from '@/components/standings-page';
import { TeamsPage } from '@/components/teams-page';
import { CalendarPage } from '@/components/calendar-page';
import { BracketPage } from '@/components/bracket-page';
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function Dashboard({ params }) {
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      fetchTournamentData();
    }
  }, [user, params.id, router]);

  const fetchTournamentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [tournamentData, teamsData, matchesData] = await Promise.all([
        getTournament(params.id),
        getTeamsByTournament(params.id),
        getMatchesByTournament(params.id)
      ]);
      
      if (!tournamentData) {
        throw new Error("Tournament not found");
      }

      setTournament(tournamentData);
      setTeams(teamsData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Error fetching tournament data:", error);
      setError("Failed to fetch tournament data. Please try again.");
      toast({
        title: "Error",
        description: "Failed to fetch tournament data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderActivePage = () => {
    switch (router.pathname) {
      case '/dashboard/[id]/standings':
        return <StandingsPage tournament={tournament} teams={teams} matches={matches} />;
      case '/dashboard/[id]/teams':
        return <TeamsPage tournament={tournament} teams={teams} />;
      case '/dashboard/[id]/calendar':
        return <CalendarPage tournament={tournament} matches={matches} />;
      case '/dashboard/[id]/bracket':
        return <BracketPage tournament={tournament} matches={matches} />;
      default:
        return <StandingsPage tournament={tournament} teams={teams} matches={matches} />;
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return <div>Loading tournament data...</div>;
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
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar tournamentId={params.id} />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">{tournament?.name}</h1>
          {renderActivePage()}
        </div>
      </main>
    </div>
  );
}