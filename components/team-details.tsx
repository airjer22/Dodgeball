import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, UserPlus, UserMinus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

export function TeamDetails({ team, onUpdateTeam }) {
  const [teamName, setTeamName] = useState(team.name);
  const [newMemberName, setNewMemberName] = useState('');
  const { toast } = useToast();

  // Ensure members and substitutes are always arrays
  const members = team.members || [];
  const substitutes = team.substitutes || [];

  const handleAddMember = (isSubstitute = false) => {
    if (newMemberName.trim()) {
      const newMember = {
        id: Date.now().toString(),
        name: newMemberName.trim(),
        isSubstitute
      };
      const updatedTeam = {
        ...team,
        members: isSubstitute 
          ? [...members]
          : [...members, newMember],
        substitutes: isSubstitute
          ? [...substitutes, newMember]
          : [...substitutes]
      };
      onUpdateTeam(updatedTeam);
      setNewMemberName('');
    }
  };

  const handleRemoveMember = (memberId, isSubstitute) => {
    const updatedTeam = {
      ...team,
      members: isSubstitute 
        ? [...members]
        : members.filter(m => m.id !== memberId),
      substitutes: isSubstitute
        ? substitutes.filter(m => m.id !== memberId)
        : [...substitutes]
    };
    onUpdateTeam(updatedTeam);
  };

  const handleToggleSubstitute = (memberId) => {
    const member = members.find(m => m.id === memberId);
    const substitute = substitutes.find(s => s.id === memberId);

    if (member) {
      // Move from members to substitutes
      const updatedTeam = {
        ...team,
        members: members.filter(m => m.id !== memberId),
        substitutes: [...substitutes, { ...member, isSubstitute: true }]
      };
      onUpdateTeam(updatedTeam);
    } else if (substitute) {
      // Move from substitutes to members
      const updatedTeam = {
        ...team,
        substitutes: substitutes.filter(s => s.id !== memberId),
        members: [...members, { ...substitute, isSubstitute: false }]
      };
      onUpdateTeam(updatedTeam);
    }
  };

  const handleSave = () => {
    const updatedTeam = { ...team, name: teamName };
    onUpdateTeam(updatedTeam);
    toast({
      title: "Success",
      description: "Team saved successfully",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Input 
            value={teamName} 
            onChange={(e) => setTeamName(e.target.value)} 
            className="text-2xl font-bold"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Team Members</h3>
          {members.map((member) => (
            <div key={member.id} className="flex items-center justify-between mb-2">
              <span>{member.name}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleSubstitute(member.id)}
                >
                  <UserMinus className="mr-2 h-4 w-4" /> Mark as Substitute
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
          {substitutes.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between mb-2">
              <span>{sub.name}</span>
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleToggleSubstitute(sub.id)}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Mark as Regular
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveMember(sub.id, true)}
                >
                  <Trash2 className="h-4 w-4" />
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
            <Button onClick={() => handleAddMember(false)}>Add as Regular</Button>
            <Button onClick={() => handleAddMember(true)} variant="outline" className="ml-2">Add as Substitute</Button>
          </div>
        </div>

        <Button className="w-full" onClick={handleSave}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}