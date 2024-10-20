import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

export function TeamList({ teams, onSelectTeam, onDeleteTeam }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mb-8">
      <Input
        type="text"
        placeholder="Search teams..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      {filteredTeams.map((team) => (
        <Card key={team.id} className="mb-2">
          <CardContent className="p-4 flex justify-between items-center">
            <button
              onClick={() => onSelectTeam(team)}
              className="text-left flex-grow hover:underline focus:outline-none"
            >
              {team.name}
            </button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteTeam(team.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}