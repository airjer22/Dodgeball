"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

export function MatchScoring({ match, onSave }) {
  const [teamA, setTeamA] = useState({ ...match.teamA, score: match.score?.teamA || 0, pins: match.pins?.teamA || 0 });
  const [teamB, setTeamB] = useState({ ...match.teamB, score: match.score?.teamB || 0, pins: match.pins?.teamB || 0 });
  const [timer, setTimer] = useState(1200); // 20 minutes in seconds
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
    const updatedMatch = {
      ...match,
      score: { teamA: teamA.score, teamB: teamB.score },
      pins: { teamA: teamA.pins, teamB: teamB.pins },
      isCompleted: true
    };
    onSave(updatedMatch);
  };

  const handleReset = () => {
    setTeamA({ ...teamA, score: 0, pins: 0 });
    setTeamB({ ...teamB, score: 0, pins: 0 });
    setTimer(300);
    setIsTimerRunning(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex justify-between items-center" variants={itemVariants}>
        <div>Match Date: {formatDate(match.scheduledDate)}</div>
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
      </motion.div>

      <motion.div className="grid grid-cols-2 gap-6" variants={itemVariants}>
        <TeamCard team={teamA} onScoreChange={(v) => handleScoreChange('A', v)} onPinChange={(v) => handlePinChange('A', v)} />
        <TeamCard team={teamB} onScoreChange={(v) => handleScoreChange('B', v)} onPinChange={(v) => handlePinChange('B', v)} />
      </motion.div>

      <motion.div className="flex justify-center space-x-4" variants={itemVariants}>
        <Button onClick={handleSave} className="hover-scale">Save Match Data</Button>
        <Button variant="outline" onClick={handleReset} className="hover-scale">Reset</Button>
      </motion.div>
    </motion.div>
  );
}

function TeamCard({ team, onScoreChange, onPinChange }) {
  return (
    <Card className="glassmorphism">
      <CardHeader>
        <CardTitle className="gradient-text">{team.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-9xl font-bold mb-4 gradient-text">{team.score}</div>
          <div className="flex justify-center space-x-2">
            <Button size="icon" variant="outline" onClick={() => onScoreChange(-1)} className="hover-scale"><Minus className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => onScoreChange(1)} className="hover-scale"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
        <div className="text-center">
          <Label className="text-xl">Pins</Label>
          <div className="text-6xl font-semibold mb-2 gradient-text">{team.pins}</div>
          <div className="flex justify-center space-x-2">
            <Button size="icon" variant="outline" onClick={() => onPinChange(-1)} className="hover-scale"><Minus className="h-4 w-4" /></Button>
            <Button size="icon" variant="outline" onClick={() => onPinChange(1)} className="hover-scale"><Plus className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}