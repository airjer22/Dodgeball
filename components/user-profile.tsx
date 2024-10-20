import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from 'firebase/auth';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <Avatar>
        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
        <AvatarFallback>{user.displayName ? user.displayName[0] : 'U'}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">{user.displayName || 'User'}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}