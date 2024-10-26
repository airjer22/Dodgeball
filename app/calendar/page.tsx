"use client"

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

interface Match {
  id: string;
  date: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  tournamentId: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [matches, setMatches] = useState<Match[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user || !date) return;

      try {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const matchesRef = collection(db, 'matches');
        const q = query(matchesRef, where('date', '==', formattedDate));
        const querySnapshot = await getDocs(q);
        
        const matchesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Match[];

        setMatches(matchesData);
      } catch (error) {
        console.error('Error fetching matches:', error);
      }
    };

    fetchMatches();
  }, [date, user]);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-8">
      <div className="w-full md:w-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-4">
          Matches for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
        </h2>
        {matches.length > 0 ? (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card key={match.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium">{match.team1}</p>
                  </div>
                  <div className="px-4 font-bold">
                    {match.score1} - {match.score2}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="font-medium">{match.team2}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No matches scheduled for this date.</p>
        )}
      </div>
    </div>
  );
}
