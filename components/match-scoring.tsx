"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from 'lucide-react';

export function MatchScoring({ match, onSave }) {
  const [teamA, setTeamA] = useState(match.teamA);
  const [teamB, setTeamB] = useState(match.teamB);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      playBuzzerSound();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const playBuzzerSound = () => {
    // In a real app, implement sound playing logic here
    console.log('BUZZER SOUND!');
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleScoreChange = (team, value) => {
    if (team === 'A') {
      setTeamA({ ...teamA, score: Math.max(0, teamA.score + value) });
    } else {
      setTeamB({ ...teamB, score: Math.max(0, teamB.score + value) });
    }
  };

  const handlePinChange = (team, value) => {
    if (team === 'A') {
      setTeamA({ ...teamA, pins: Math.max(0, teamA.pins + value) });
    } else {
      setTeamB({ ...teamB, pins: Math.max(0, teamB.pins + value) });
    }
  };

  const handleSave = () => {
    onSave({ ...match, teamA, teamB });
  };

  const handleReset = () => {
    setTeamA({ ...teamA, score: 0, pins: 0 });
    setTeamB({ ...teamB, score: 0, pins: 0 });
    setTimer(300);
    setIsTimerRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>Match Date: {new Date(match.date).toLocaleDateString()}</div>
        <div className={`text-6xl font-bold ${timer <= 60 ? 'text-red-500 text-8xl' : ''}`}>
          {formatTime(timer)}
        </div>
        <div>
          <Input
            type="number"
            value={timer}
            onChange={(e) => setTimer(Number(e.target.value))}
            className="w-20 mr-2"
          />
          <Button onClick={() => setIsTimerRunning(!isTimerRunning)}>
            {isTimerRunning ? 'Pause' : 'Start'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <TeamCard team={teamA} onScoreChange={(v) => handleScoreChange('A', v)} onPinChange={(v) => handlePinChange('A', v)} />
        <TeamCard team={teamB} onScoreChange={(v) => handleScoreChange('B', v)} onPinChange={(v) => handlePinChange('B', v)} />
      </div>

      <div className="flex justify-center space-x-4">
        <Button onClick={handleSave}>Save Match Data</Button>
        <Button variant="outline" onClick={handleReset}>Reset</Button>
      </div>
    </div>
  );
}

function TeamCard({ team, onScoreChange, onPinChange }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-9x1 font-bold mb-4">{team.score}</div>
          <div className="flex justify-center space-x-2">
            <Button size="icon" variant="outline" onClick={() => onScoreChange(-1)}><Minus className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => onScoreChange(1)}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="text-center">
          <Label className="text-xl">Pins</Label>
          <div className="text-6xl font-semibold mb-2">{team.pins}</div>
          <div className="flex justify-center space-x-2">
            <Button size="icon" variant="outline" onClick={() => onPinChange(-1)}><Minus className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => onPinChange(1)}><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}