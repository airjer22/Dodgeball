"use client"

import { useState, useEffect } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TeamList } from '@/components/team-list';
import { TeamDetails } from '@/components/team-details';
import { Button } from "@/components/ui/button";
import { useTournament } from '@/contexts/TournamentContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { selectedTournament } = useTournament();

  useEffect(() => {
    if (selectedTournament) {
      // In a real application, you would fetch this data from your backend based on the selected tournament
      const dummyTeams = [
        { id: 1, name: 'Team Alpha', members: [
          { id: 1, name: 'John Doe', isSubstitute: false },
          { id: 2, name: 'Jane Smith', isSubstitute: false },
        ], substitutes: [
          { id: 3, name: 'Mike Johnson', isSubstitute: true },
          { id: 4, name: 'Sarah Williams', isSubstitute: true },
        ]},
        { id: 2, name: 'Team Beta', members: [], substitutes: [] },
        { id: 3, name: 'Team Gamma', members: [], substitutes: [] },
      ];
      setTeams(dummyTeams);
    }
  }, [selectedTournament]);

  const handleAddTeam = () => {
    const newTeam = {
      id: Date.now(),
      name: `New Team ${teams.length + 1}`,
      members: [],
      substitutes: []
    };
    setTeams([...teams, newTeam]);
  };

  const handleDeleteTeam = (teamId) => {
    setTeams(teams.filter(team => team.id !== teamId));
    if (selectedTeam && selectedTeam.id === teamId) {
      setSelectedTeam(null);
    }
  };

  const handleUpdateTeam = (updatedTeam) => {
    setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
    setSelectedTeam(updatedTeam);
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Teams</h1>
            {selectedTournament && <Button onClick={handleAddTeam}>Add Team</Button>}
          </div>
          {selectedTournament ? (
            <>
              <TeamList 
                teams={teams} 
                onSelectTeam={setSelectedTeam} 
                onDeleteTeam={handleDeleteTeam}
              />
              {selectedTeam && (
                <TeamDetails 
                  team={selectedTeam} 
                  onUpdateTeam={handleUpdateTeam}
                />
              )}
            </>
          ) : (
            <Alert variant="warning">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No tournament selected</AlertTitle>
              <AlertDescription>
                Please select a tournament from the dashboard to manage teams.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </main>
    </div>
  );
}