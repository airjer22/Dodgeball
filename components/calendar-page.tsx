"use client"

import { useState, useEffect, useCallback } from 'react';
import { MatchList } from '@/components/match-list';
import { TournamentCalendar } from '@/components/tournament-calendar';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getMatchesByTournament, getTeamsByTournament, updateMatch } from '@/lib/firestore';

export function CalendarPage({ tournament }) {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [scheduledMatches, setScheduledMatches] = useState({});
  const [unscheduledMatches, setUnscheduledMatches] = useState([]);
  const { toast } = useToast();

  const fetchTeamsAndMatches = useCallback(async () => {
    try {
      const [fetchedMatches, fetchedTeams] = await Promise.all([
        getMatchesByTournament(tournament.id),
        getTeamsByTournament(tournament.id)
      ]);
      setMatches(fetchedMatches);
      setTeams(fetchedTeams);

      // Initialize scheduledMatches and unscheduledMatches
      const scheduled = {};
      const unscheduled = [];
      fetchedMatches.forEach(match => {
        if (match.scheduledDate) {
          const date = new Date(match.scheduledDate).toISOString().split('T')[0];
          if (!scheduled[date]) scheduled[date] = [];
          scheduled[date].push(match);
        } else {
          unscheduled.push(match);
        }
      });
      setScheduledMatches(scheduled);
      setUnscheduledMatches(unscheduled);
    } catch (error) {
      console.error("Error fetching teams and matches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch calendar data. Please try again.",
        variant: "destructive",
      });
    }
  }, [tournament.id, toast]);

  useEffect(() => {
    if (tournament) {
      fetchTeamsAndMatches();
    }
  }, [tournament, fetchTeamsAndMatches]);

  const handleSaveCalendar = async () => {
    try {
      const updatePromises = Object.values(scheduledMatches)
        .flat()
        .map(match => updateMatch(match.id, { scheduledDate: match.scheduledDate }));
      
      await Promise.all(updatePromises);
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Calendar saved successfully.",
      });
      fetchTeamsAndMatches(); // Refresh the data
    } catch (error) {
      console.error("Error saving calendar:", error);
      toast({
        title: "Error",
        description: "Failed to save calendar. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditCalendar = () => {
    setIsEditing(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div>
          {isEditing ? (
            <Button onClick={handleSaveCalendar}>Save Calendar</Button>
          ) : (
            <Button onClick={handleEditCalendar}>Edit Calendar</Button>
          )}
        </div>
      </div>
      <div className="flex h-[calc(100vh-12rem)] space-x-4">
        <MatchList 
          matches={unscheduledMatches} 
          scheduledMatches={scheduledMatches} 
          isEditing={isEditing}
          setUnscheduledMatches={setUnscheduledMatches}
          setScheduledMatches={setScheduledMatches}
        />
        <TournamentCalendar 
          matches={matches} 
          isEditing={isEditing} 
          scheduledMatches={scheduledMatches}
          setScheduledMatches={setScheduledMatches}
          setUnscheduledMatches={setUnscheduledMatches}
        />
      </div>
    </div>
  );
}