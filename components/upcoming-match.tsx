import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function UpcomingMatch({ match }) {
  if (!match) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Upcoming Match</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
            {match.teamA[0]}
          </div>
          <span className="text-xl font-semibold">{match.teamA}</span>
        </div>
        <span className="text-2xl font-bold">VS</span>
        <div className="flex items-center space-x-4">
          <span className="text-xl font-semibold">{match.teamB}</span>
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold">
            {match.teamB[0]}
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold">{match.date}</div>
          <div className="text-sm text-gray-500">{match.time}</div>
        </div>
      </CardContent>
    </Card>
  );
}