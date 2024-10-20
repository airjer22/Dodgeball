"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Tournament {
  id: number;
  name: string;
}

interface TournamentContextType {
  selectedTournament: Tournament | null;
  setSelectedTournament: (tournament: Tournament | null) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);

  return (
    <TournamentContext.Provider value={{ selectedTournament, setSelectedTournament }}>
      {children}
    </TournamentContext.Provider>
  );
}

export function useTournament() {
  const context = useContext(TournamentContext);
  if (context === undefined) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
}