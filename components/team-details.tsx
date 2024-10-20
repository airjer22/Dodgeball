import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, X } from 'lucide-react';

export function TeamDetails({ team, onUpdateTeam }) {
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = (isSubstitute = false) => {
    if (newMemberName.trim()) {
      const newMember = {
        id: Date.now(),
        name: newMemberName.trim(),
        isSubstitute
      };
      const updatedTeam = {
        ...team,
        members: isSubstitute 
          ? [...team.members]
          : [...team.members, newMember],
        substitutes: isSubstitute
          ? [...team.substitutes, newMember]
          : [...team.substitutes]
      };
      onUpdateTeam(updatedTeam);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (memberId, isSubstitute) => {
    const updatedTeam = {
      ...team,
      members: isSubstitute 
        ? [...team.members]
        : team.members.filter(m => m.id !== memberId),
      substitutes: isSubstitute
        ? team.substitutes.filter(m => m.id !== memberId)
        : [...team.substitutes]
    };
    onUpdateTeam(updatedTeam);
  };

  const handleToggleSubstitute = (memberId) => {
    const member = team.members.find(m => m.id === memberId);
    const substitute = team.substitutes.find(s => s.id === memberId);

    if (member) {
      // Move from members to substitutes
      const updatedTeam = {
        ...team,
        members: team.members.filter(m => m.id !== memberId),
        substitutes: [...team.substitutes, { ...member, isSubstitute: true }]
      };
      onUpdateTeam(updatedTeam);
    } else if (substitute) {
      // Move from substitutes to members
      const updatedTeam = {
        ...team,
        substitutes: team.substitutes.filter(s => s.id !== memberId),
        members: [...team.members, { ...substitute, isSubstitute: false }]
      };
      onUpdateTeam(updatedTeam);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          {team.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between mb-2">
              <span>{member.name}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleSubstitute(member.id)}
                >
                  Mark as Substitute
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMember(member.id, false)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Substitute Players</h3>
          {team.substitutes.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between mb-2">
              <span>{sub.name}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleSubstitute(sub.id)}
                >
                  Mark as Regular
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMember(sub.id, true)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6">
          <Label htmlFor="newMember">Add Member</Label>
          <div className="flex mt-1">
            <Input
              id="newMember"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="Enter member name"
              className="mr-2"
            />
            <Button onClick={() => handleAddMember(false)}>Add</Button>
          </div>
        </div>

        <Button className="w-full" onClick={() => onUpdateTeam(team)}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}