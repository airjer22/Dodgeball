"use client"

import { useState, useEffect } from 'react';
import { UpcomingMatch } from '@/components/upcoming-match';
import { StandingsTable } from '@/components/standings-table';
import { getMatchesByTournament, getTeamsByTournament } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from 'next/navigation';

export function StandingsPage({ tournament }) {
  const [upcomingMatch, setUpcomingMatch] = useState(null);
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (tournament) {
      fetchMatchesAndTeams();
    }
  }, [tournament]);

  const fetchMatchesAndTeams = async () => {
    setLoading(true);
    try {
      const [matches, teams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);

      console.log("Fetched matches:", matches);
      console.log("Fetched teams:", teams);

      // Create a map of team IDs to team names
      const teamMap = teams.reduce((acc, team) => {
        acc[team.id] = team.name;
        return acc;
      }, {});

      // Normalize match data
      const normalizedMatches = matches.map(match => ({
        ...match,
        teamAName: teamMap[match.teamA] || 'Unknown Team',
        teamBName: teamMap[match.teamB] || 'Unknown Team',
      }));

      // Calculate standings
      const standingsData = calculateStandings(teams, normalizedMatches);

      // Sort standings
      const sortedStandings = sortStandings(standingsData);
      setStandings(sortedStandings);

      // Set upcoming match (only one)
      const upcoming = normalizedMatches
        .filter(match => !match.isCompleted && match.scheduledDate)
        .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
        [0];
      setUpcomingMatch(upcoming);
    } catch (error) {
      console.error("Error fetching matches and teams:", error);
      toast({
        title: "Error",
        description: "Failed to fetch standings data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStandings = (teams, matches) => {
    const standingsMap = teams.reduce((acc, team) => {
      acc[team.id] = {
        id: team.id,
        name: team.name,
        wins: 0,
        ties: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        pins: 0
      };
      return acc;
    }, {});

    matches.forEach(match => {
      if (match.isCompleted) {
        const teamA = standingsMap[match.teamA];
        const teamB = standingsMap[match.teamB];

        if (teamA && teamB) {
          const scoreA = match.score.teamA;
          const scoreB = match.score.teamB;

          teamA.gf += scoreA;
          teamA.ga += scoreB;
          teamA.pins += match.pins.teamA;

          teamB.gf += scoreB;
          teamB.ga += scoreA;
          teamB.pins += match.pins.teamB;

          if (scoreA > scoreB) {
            teamA.wins++;
            teamB.losses++;
          } else if (scoreB > scoreA) {
            teamB.wins++;
            teamA.losses++;
          } else {
            teamA.ties++;
            teamB.ties++;
          }
        }
      }
    });

    return Object.values(standingsMap);
  };

  const sortStandings = (standings) => {
    return standings.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.ties !== a.ties) return b.ties - a.ties;
      if (b.gf !== a.gf) return b.gf - a.gf;
      if (a.ga !== b.ga) return a.ga - b.ga;
      return b.pins - a.pins;
    });
  };

  const handleUpcomingMatchClick = () => {
    if (upcomingMatch) {
      router.push(`/match/${upcomingMatch.id}`);
    }
  };

  if (loading) {
    return <div>Loading standings...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Upcoming Match</h2>
      {upcomingMatch ? (
        <div onClick={handleUpcomingMatchClick} className="cursor-pointer">
          <UpcomingMatch match={upcomingMatch} />
        </div>
      ) : (
        <p>No upcoming matches scheduled.</p>
      )}
      <h2 className="text-xl font-semibold my-4">Standings</h2>
      <StandingsTable standings={standings} />
    </div>
  );
}