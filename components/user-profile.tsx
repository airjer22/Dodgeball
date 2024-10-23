"use client"

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { User } from 'firebase/auth';
import { updateUserProfile } from '@/lib/firebase';
import { useToast } from "@/components/ui/use-toast"

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName || '');
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    const success = await updateUserProfile(displayName);
    if (success) {
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Username updated successfully.",
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to update username. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setDisplayName(user.displayName || '');
    setIsEditing(false);
  };

  return (
    <div className="flex items-center space-x-4 mb-8">
      <Avatar>
        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
        <AvatarFallback>{user.displayName ? user.displayName[0] : 'U'}</AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSave}>Save</Button>
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold">{user.displayName || 'User'}</h2>
            <Button variant="outline" size="sm" onClick={handleEdit}>Edit</Button>
          </div>
        )}
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}