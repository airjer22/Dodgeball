import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpcomingMatch({ match }) {
  if (!match) return null;

  const teamAInitial = match.teamAName ? match.teamAName[0] : '?';
  const teamBInitial = match.teamBName ? match.teamBName[0] : '?';

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBA';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'Time TBA';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="mb-6 hover:bg-accent transition-colors">
      <CardHeader>
        <CardTitle>Upcoming Match</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
            {teamAInitial}
          </div>
          <span className="text-xl font-semibold">{match.teamAName || 'TBA'}</span>
        </div>
        <span className="text-2xl font-bold">VS</span>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold">{match.teamBName || 'TBA'}</span>
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
            {teamBInitial}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{formatDate(match.scheduledDate)}</div>
          <div className="text-sm text-gray-500">{formatTime(match.scheduledDate)}</div>
        </div>
      </CardContent>
    </Card>
  );
}