import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowUp, ArrowDown } from 'lucide-react';

export function StandingsTable({ standings }) {
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
          <TableHead className="text-right">Streak</TableHead>
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
            <TableCell className="text-right">
              {team.streak.type === 'win' ? (
                <ArrowUp className="inline-block text-green-500 mr-1" />
              ) : (
                <ArrowDown className="inline-block text-red-500 mr-1" />
              )}
              {team.streak.count}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}