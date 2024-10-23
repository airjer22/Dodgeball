"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { motion } from 'framer-motion';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function TournamentCalendar({ matches, isEditing, scheduledMatches, setScheduledMatches, setUnscheduledMatches }) {
  const [date, setDate] = useState(new Date());
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const router = useRouter();

  useEffect(() => {
    setDate(new Date(date.getFullYear(), date.getMonth(), 1));
  }, []);

  const handleDrop = (e, day) => {
    e.preventDefault();
    if (!isEditing) return;

    const matchData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const dayKey = day.toISOString().split('T')[0];

    setSelectedMatch({ ...matchData, scheduledDate: dayKey });
    setIsTimeDialogOpen(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
  };

  const handleRemoveMatch = (match, dayKey) => {
    setScheduledMatches(prev => {
      const newScheduledMatches = { ...prev };
      newScheduledMatches[dayKey] = newScheduledMatches[dayKey].filter(m => m.id !== match.id);
      return newScheduledMatches;
    });

    setUnscheduledMatches(prev => [...prev, { ...match, scheduledDate: null }]);
  };

  const handleMatchClick = (match) => {
    if (isEditing) {
      setSelectedMatch(match);
      setSelectedTime(match.scheduledTime || '12:00');
      setIsTimeDialogOpen(true);
    } else {
      router.push(`/match/${match.id}`);
    }
  };

  const handleTimeConfirm = () => {
    const dayKey = selectedMatch.scheduledDate;
    const updatedMatch = { ...selectedMatch, scheduledTime: selectedTime };

    setScheduledMatches(prev => {
      const newScheduledMatches = { ...prev };
      if (!newScheduledMatches[dayKey]) {
        newScheduledMatches[dayKey] = [];
      }
      const existingIndex = newScheduledMatches[dayKey].findIndex(m => m.id === updatedMatch.id);
      if (existingIndex !== -1) {
        newScheduledMatches[dayKey][existingIndex] = updatedMatch;
      } else {
        newScheduledMatches[dayKey].push(updatedMatch);
      }
      return newScheduledMatches;
    });

    setUnscheduledMatches(prev => prev.filter(m => m.id !== updatedMatch.id));
    setIsTimeDialogOpen(false);
    setSelectedMatch(null);
  };

  const calendarVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cellVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  const renderCell = (day) => {
    const dayKey = day.toISOString().split('T')[0];
    const matchesForDay = scheduledMatches[dayKey] || [];
    const isCurrentMonth = day.getMonth() === date.getMonth();

    return (
      <motion.div
        key={dayKey}
        variants={cellVariants}
        onDrop={(e) => handleDrop(e, day)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`h-24 border p-1 transition-colors ${
          isCurrentMonth ? 'bg-background' : 'bg-muted'
        } ${isEditing ? 'cursor-pointer' : ''} glassmorphism`}
      >
        <div className={`font-semibold ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
          {day.getDate()}
        </div>
        <div className="overflow-y-auto h-[calc(100%-1.5rem)]">
          {matchesForDay.map((match, index) => (
            <Card 
              key={`${match.id}-${index}`} 
              className={`mt-1 ${match.isCompleted ? 'bg-green-500' : 'bg-primary'} text-primary-foreground cursor-pointer hover-scale`}
              draggable={isEditing}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify(match))}
              onClick={() => handleMatchClick(match)}
            >
              <CardContent className="p-1 text-xs flex justify-between items-center">
                <span>{match.teamAName} vs {match.teamBName}</span>
                <span>{match.scheduledTime || '12:00'}</span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMatch(match, dayKey);
                    }}
                  >
                    ×
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderCalendar = () => {
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDay = startDate.getDay();
    const totalDays = endDate.getDate();

    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const day = new Date(date.getFullYear(), date.getMonth(), i - startDay + 1);
      calendarDays.push(day);
    }

    return calendarDays.map(renderCell);
  };

  const prevMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1));
  };

  return (
    <div className="w-3/4 overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <Button onClick={prevMonth} variant="outline" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-semibold gradient-text">
          {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <Button onClick={nextMonth} variant="outline" size="icon">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <motion.div 
        className="grid grid-cols-7 gap-1"
        variants={calendarVariants}
        initial="hidden"
        animate="visible"
      >
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="text-center font-semibold text-primary">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </motion.div>
      <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Match Time</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <Input
              type="time"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleTimeConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}