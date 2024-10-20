import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function UserProfile({ user }) {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <h2 className="text-2xl font-bold">{user.name}</h2>
        <p className="text-gray-500">{user.email}</p>
      </div>
    </div>
  );
}