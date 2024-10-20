import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function StandingsTable({ standings = [] }) {
  if (standings.length === 0) {
    return <p>No standings data available.</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team</TableHead>
          <TableHead className="text-right">W</TableHead>
          <TableHead className="text-right">T</TableHead>
          <TableHead className="text-right">L</TableHead>
          <TableHead className="text-right">GF</TableHead>
          <TableHead className="text-right">GA</TableHead>
          <TableHead className="text-right">Pins</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {standings.map((team) => (
          <TableRow key={team.id}>
            <TableCell className="font-medium">{team.name}</TableCell>
            <TableCell className="text-right">{team.wins}</TableCell>
            <TableCell className="text-right">{team.ties}</TableCell>
            <TableCell className="text-right">{team.losses}</TableCell>
            <TableCell className="text-right">{team.gf}</TableCell>
            <TableCell className="text-right">{team.ga}</TableCell>
            <TableCell className="text-right">{team.pins}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}