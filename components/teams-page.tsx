"use client"

import { useState, useEffect, useCallback } from 'react';
import { TeamList } from '@/components/team-list';
import { TeamDetails } from '@/components/team-details';
import { useToast } from "@/components/ui/use-toast";
import { getTeamsByTournament, updateTeam } from '@/lib/firestore';

export function TeamsPage({ tournament }) {
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { toast } = useToast();

  const fetchTeams = useCallback(async () => {
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
  }, [tournament.id, toast]);

  useEffect(() => {
    if (tournament) {
      fetchTeams();
    }
  }, [tournament, fetchTeams]);

  const handleUpdateTeam = async (updatedTeam) => {
    try {
      await updateTeam(updatedTeam.id, updatedTeam);
      setTeams(teams.map(team => team.id === updatedTeam.id ? updatedTeam : team));
      setSelectedTeam(updatedTeam);
      toast({
        title: "Success",
        description: "Team updated successfully.",
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Teams</h2>
      <div className="flex">
        <div className="w-1/3 pr-4">
          <TeamList 
            teams={teams} 
            onSelectTeam={setSelectedTeam}
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