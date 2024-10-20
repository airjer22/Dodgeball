"use client"

import { useState, useEffect } from 'react';
import { TeamList } from '@/components/team-list';
import { TeamDetails } from '@/components/team-details';
import { getTeamsByTournament, createTeam, updateTeam, deleteTeam } from '@/lib/firestore';
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { PlusCircle } from 'lucide-react';

export function TeamsPage({ tournament }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (tournament) {
      fetchTeams();
    }
  }, [tournament]);

  const fetchTeams = async () => {
    try {
      const fetchedTeams = await getTeamsByTournament(tournament.id);
      setTeams(fetchedTeams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teams. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddTeam = async () => {
    try {
      const newTeam = {
        name: `New Team ${teams.length + 1}`,
        tournamentId: tournament.id,
        members: [],
        substitutes: []
      };
      const addedTeam = await createTeam(newTeam);
      setTeams([...teams, addedTeam]);
      setSelectedTeam(addedTeam);
      toast({
        title: "Team Added",
        description: "New team has been added successfully.",
      });
    } catch (error) {
      console.error("Error adding team:", error);
      toast({
        title: "Error",
        description: "Failed to add new team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateTeam = async (updatedTeam) => {
    try {
      await updateTeam(updatedTeam.id, updatedTeam);
      setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
      setSelectedTeam(updatedTeam);
      toast({
        title: "Team Updated",
        description: "Team has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating team:", error);
      toast({
        title: "Error",
        description: "Failed to update team. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeam = async (teamId) => {
    try {
      await deleteTeam(teamId);
      setTeams(teams.filter(team => team.id !== teamId));
      if (selectedTeam && selectedTeam.id === teamId) {
        setSelectedTeam(null);
      }
      toast({
        title: "Team Deleted",
        description: "Team has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting team:", error);
      toast({
        title: "Error",
        description: "Failed to delete team. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Teams</h2>
        <Button onClick={handleAddTeam}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Team
        </Button>
      </div>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <TeamList 
            teams={teams} 
            onSelectTeam={setSelectedTeam}
            onDeleteTeam={handleDeleteTeam}
          />
        </div>
        <div className="w-2/3">
          {selectedTeam && (
            <TeamDetails 
              team={selectedTeam} 
              onUpdateTeam={handleUpdateTeam}
            />
          )}
        </div>
      </div>
    </div>
  );
}