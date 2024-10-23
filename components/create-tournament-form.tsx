import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Trash2 } from 'lucide-react';
import { createTournament, createTeam, createMatch } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"

export function CreateTournamentForm({ onCreateTournament, onCancel }) {
  const [tournamentName, setTournamentName] = useState('');
  const [numberOfTeams, setNumberOfTeams] = useState('');
  const [numberOfRounds, setNumberOfRounds] = useState('');
  const [teams, setTeams] = useState(['', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    return matches.sort((a, b) => a.round - b.round);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Validate input
      if (!tournamentName.trim()) {
        throw new Error("Tournament name is required.");
      }
      const teamsCount = parseInt(numberOfTeams);
      const roundsCount = parseInt(numberOfRounds);
      if (isNaN(teamsCount) || teamsCount < 2) {
        throw new Error("Number of teams must be at least 2.");
      }
      if (isNaN(roundsCount) || roundsCount < 1) {
        throw new Error("Number of rounds must be at least 1.");
      }
      const validTeams = teams.filter(team => team.trim() !== '');
      if (validTeams.length < 2) {
        throw new Error("At least 2 teams are required.");
      }

      // Create tournament
      const tournamentRef = await createTournament({
        name: tournamentName,
        teams: teamsCount,
        rounds: roundsCount,
        startDate: new Date().toISOString(),
        status: 'upcoming'
      });

      // Create teams
      const teamPromises = validTeams.map(teamName => 
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
      const matches = generateMatches(teamIds, roundsCount);
      const matchPromises = matches.map(match => 
        createMatch({
          ...match,
          tournamentId: tournamentRef.id,
          teamAName: validTeams[teamIds.indexOf(match.teamA)],
          teamBName: validTeams[teamIds.indexOf(match.teamB)]
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
        description: error.message || "Failed to create tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="tournamentName">Tournament Name</Label>
              <Input
                id="tournamentName"
                value={tournamentName}
                onChange={(e) => setTournamentName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="numberOfTeams">Number of Teams</Label>
              <Input
                id="numberOfTeams"
                type="number"
                value={numberOfTeams}
                onChange={(e) => setNumberOfTeams(e.target.value)}
                required
                min="2"
              />
            </div>
            <div>
              <Label htmlFor="numberOfRounds">Number of Rounds</Label>
              <Input
                id="numberOfRounds"
                type="number"
                value={numberOfRounds}
                onChange={(e) => setNumberOfRounds(e.target.value)}
                required
                min="1"
              />
            </div>
            <div>
              <Label>Teams</Label>
              {teams.map((team, index) => (
                <div key={index} className="flex items-center space-x-2 mt-2">
                  <Input
                    value={team}
                    onChange={(e) => handleTeamNameChange(index, e.target.value)}
                    placeholder={`Team ${index + 1}`}
                  />
                  {index > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveTeam(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" className="mt-2" onClick={handleAddTeam}>
                Add Team
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Tournament'}
        </Button>
      </CardFooter>
    </Card>
  );
}