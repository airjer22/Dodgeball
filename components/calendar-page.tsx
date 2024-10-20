"use client"

import { useState, useEffect } from 'react';
import { MatchList } from '@/components/match-list';
import { TournamentCalendar } from '@/components/tournament-calendar';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getMatchesByTournament, updateMatchSchedule, getTeamsByTournament } from '@/lib/firestore';

export function CalendarPage({ tournament }) {
  const [isEditing, setIsEditing] = useState(false);
  const [matches, setMatches] = useState([]);
  const [scheduledMatches, setScheduledMatches] = useState({});
  const [teams, setTeams] = useState({});
  const { toast } = useToast();

  useEffect(() => {
    if (tournament) {
      fetchTeamsAndMatches();
    }
  }, [tournament]);

  const fetchTeamsAndMatches = async () => {
    try {
      const [fetchedTeams, fetchedMatches] = await Promise.all([
        getTeamsByTournament(tournament.id),
        getMatchesByTournament(tournament.id)
      ]);

      const teamMap = fetchedTeams.reduce((acc, team) => {
        acc[team.id] = team.name;
        return acc;
      }, {});
      setTeams(teamMap);

      const matchesWithTeamNames = fetchedMatches
        .map(match => ({
          ...match,
          teamAName: teamMap[match.teamA] || 'Unknown Team',
          teamBName: teamMap[match.teamB] || 'Unknown Team'
        }))
        .sort((a, b) => a.round - b.round);

      setMatches(matchesWithTeamNames);
      
      const scheduled = {};
      matchesWithTeamNames.forEach(match => {
        if (match.scheduledDate) {
          const dateKey = new Date(match.scheduledDate).toISOString().split('T')[0];
          if (!scheduled[dateKey]) scheduled[dateKey] = [];
          scheduled[dateKey].push(match);
        }
      });
      setScheduledMatches(scheduled);
    } catch (error) {
      console.error("Error fetching teams and matches:", error);
      toast({
        title: "Error",
        description: "Failed to fetch teams and matches. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveCalendar = async () => {
    try {
      const updatePromises = Object.values(scheduledMatches).flat().map(match => 
        updateMatchSchedule(match.id, new Date(match.scheduledDate))
      );
      await Promise.all(updatePromises);

      toast({
        title: "Success",
        description: "Calendar saved successfully.",
      });
      setIsEditing(false);
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

  const handleScheduleMatch = (match, date, sourceDate) => {
    setScheduledMatches(prev => {
      const newScheduledMatches = { ...prev };
      const dayKey = date.toISOString().split('T')[0];

      if (sourceDate) {
        newScheduledMatches[sourceDate] = newScheduledMatches[sourceDate].filter(m => m.id !== match.id);
      }

      if (!newScheduledMatches[dayKey]) {
        newScheduledMatches[dayKey] = [];
      }
      newScheduledMatches[dayKey].push({ ...match, scheduledDate: date.toISOString() });

      return newScheduledMatches;
    });

    setMatches(prevMatches => 
      prevMatches.map(m => 
        m.id === match.id ? { ...m, scheduledDate: date.toISOString() } : m
      )
    );
  };

  const handleUnscheduleMatch = (match, dayKey) => {
    setScheduledMatches(prev => {
      const newScheduledMatches = { ...prev };
      newScheduledMatches[dayKey] = newScheduledMatches[dayKey].filter(m => m.id !== match.id);
      if (newScheduledMatches[dayKey].length === 0) {
        delete newScheduledMatches[dayKey];
      }
      return newScheduledMatches;
    });

    setMatches(prevMatches => 
      prevMatches.map(m => 
        m.id === match.id ? { ...m, scheduledDate: null } : m
      )
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">MatchMaster Calendar</h2>
        <div>
          {isEditing ? (
            <Button onClick={handleSaveCalendar}>Save Calendar</Button>
          ) : (
            <Button onClick={handleEditCalendar}>Edit Calendar</Button>
          )}
        </div>
      </div>
      <div className="flex flex-1 space-x-4 overflow-hidden">
        <div className="w-1/4 overflow-y-auto">
          <MatchList 
            matches={matches} 
            scheduledMatches={scheduledMatches} 
            isEditing={isEditing}
          />
        </div>
        <div className="w-3/4 overflow-y-auto">
          <TournamentCalendar 
            matches={matches} 
            isEditing={isEditing} 
            scheduledMatches={scheduledMatches}
            onScheduleMatch={handleScheduleMatch}
            onUnscheduleMatch={handleUnscheduleMatch}
          />
        </div>
      </div>
    </div>
  );
}