"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function TournamentList({ tournaments, onDeleteTournament }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tournamentToDelete, setTournamentToDelete] = useState(null);
  const router = useRouter();

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = () => {
    if (tournamentToDelete) {
      onDeleteTournament(tournamentToDelete.id);
      setTournamentToDelete(null);
    }
  };

  const handleViewDashboard = (tournament) => {
    router.push(`/dashboard/${tournament.id}`);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Your Tournaments</h2>
      <Input
        type="text"
        placeholder="Search tournaments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredTournaments.map((tournament) => (
        <Card key={tournament.id} className="mb-2">
          <CardContent className="p-4 flex justify-between items-center">
            <span>{tournament.name}</span>
            <div>
              <Button onClick={() => handleViewDashboard(tournament)} className="mr-2">
                View Dashboard
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" onClick={() => setTournamentToDelete(tournament)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the tournament
                      "{tournament.name}" and all of its associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setTournamentToDelete(null)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}