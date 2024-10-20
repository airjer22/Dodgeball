import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from 'lucide-react';
import { createTournament, createTeam, createMatch } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"

export function CreateTournamentForm({ onCreateTournament }) {
  const [tournamentName, setTournamentName] = useState('');
  const [numberOfTeams, setNumberOfTeams] = useState('');
  const [numberOfRounds, setNumberOfRounds] = useState('');
  const [teams, setTeams] = useState(['', '']);
  const { toast } = useToast();

  const handleAddTeam = () => {
    setTeams([...teams, '']);
  };

  const handleRemoveTeam = (index) => {
    const newTeams = teams.filter((_, i) => i !== index);
    setTeams(newTeams);
  };

  const handleTeamNameChange = (index, value) => {
    const newTeams = [...teams];
    newTeams[index] = value;
    setTeams(newTeams);
  };

  const generateMatches = (teamIds, rounds) => {
    let matches = [];
    for (let round = 1; round <= rounds; round++) {
      for (let i = 0; i < teamIds.length; i++) {
        for (let j = i + 1; j < teamIds.length; j++) {
          matches.push({
            teamA: teamIds[i],
            teamB: teamIds[j],
            round: round,
            score: { teamA: 0, teamB: 0 },
            pins: { teamA: 0, teamB: 0 },
            isCompleted: false
          });
        }
      }
    }
    // Sort matches by round
    return matches.sort((a, b) => a.round - b.round);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create tournament
      const tournamentRef = await createTournament({
        name: tournamentName,
        teams: parseInt(numberOfTeams),
        rounds: parseInt(numberOfRounds),
        startDate: new Date().toISOString(),
        status: 'upcoming'
      });

      // Create teams
      const teamPromises = teams.filter(team => team !== '').map(teamName => 
        createTeam({
          name: teamName,
          tournamentId: tournamentRef.id,
          members: [],
          substitutes: []
        })
      );

      const createdTeams = await Promise.all(teamPromises);
      const teamIds = createdTeams.map(team => team.id);

      // Generate and create matches
      const matches = generateMatches(teamIds, parseInt(numberOfRounds));
      const matchPromises = matches.map(match => 
        createMatch({
          ...match,
          tournamentId: tournamentRef.id
        })
      );

      await Promise.all(matchPromises);

      // Notify parent component
      onCreateTournament({ id: tournamentRef.id, name: tournamentName });

      toast({
        title: "Success",
        description: "Tournament created successfully with teams and matches.",
      });

      // Reset form
      setTournamentName('');
      setNumberOfTeams('');
      setNumberOfRounds('');
      setTeams(['', '']);
    } catch (error) {
      console.error("Error creating tournament:", error);
      toast({
        title: "Error",
        description: "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ... rest of the component remains the same
}