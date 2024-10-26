import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Eye } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { deleteTournament } from '@/lib/firestore';
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
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';

interface Tournament {
  id: string;
  name: string;
  date: string;
  location: string;
  [key: string]: any;
}

interface TournamentListProps {
  tournaments: Tournament[];
  onDeleteTournament: (id: string) => void;
  onSelectTournament: (tournament: Tournament) => void;
}

export function TournamentList({ tournaments, onDeleteTournament, onSelectTournament }: TournamentListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const filteredTournaments = tournaments.filter(tournament =>
    tournament.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteConfirm = async () => {
    if (tournamentToDelete) {
      try {
        await deleteTournament(tournamentToDelete.id);
        onDeleteTournament(tournamentToDelete.id);
        setTournamentToDelete(null);
        toast({
          title: "Success",
          description: "Tournament and all associated data have been deleted.",
        });
      } catch (error) {
        console.error("Error deleting tournament:", error);
        toast({
          title: "Error",
          description: "Failed to delete tournament. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleViewDashboard = (tournament: Tournament) => {
    onSelectTournament(tournament);
  };

  const listVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4 gradient-text">Your Tournaments</h2>
      <Input
        type="text"
        placeholder="Search tournaments..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      <motion.div
        variants={listVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredTournaments.map((tournament) => (
          <motion.div key={tournament.id} variants={itemVariants}>
            <Card className="mb-2 hover-scale glassmorphism">
              <CardContent className="p-4 flex justify-between items-center">
                <span className="font-medium">{tournament.name}</span>
                <div>
                  <Button onClick={() => handleViewDashboard(tournament)} className="mr-2" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    View
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
                          "{tournament.name}" and all of its associated data, including teams and matches.
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
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
