"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from 'lucide-react';

export function CreateTournamentForm({ onCreateTournament }) {
  const [tournamentName, setTournamentName] = useState('');
  const [numberOfTeams, setNumberOfTeams] = useState('');
  const [numberOfRounds, setNumberOfRounds] = useState('');
  const [teams, setTeams] = useState(['', '']);
  const router = useRouter();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTournament = {
      name: tournamentName,
      teams: parseInt(numberOfTeams),
      rounds: parseInt(numberOfRounds),
      date: new Date().toLocaleDateString(),
      teamList: teams.filter(team => team !== '')
    };
    onCreateTournament(newTournament);
    // Reset form
    setTournamentName('');
    setNumberOfTeams('');
    setNumberOfRounds('');
    setTeams(['', '']);
    // Redirect to calendar page
    router.push('/calendar');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>
          <div>
            <Label>Team Names</Label>
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
          <Button type="submit">Generate Tournament</Button>
        </form>
      </CardContent>
    </Card>
  );
}