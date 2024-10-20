"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/sidebar'
import { MatchScoring } from '@/components/match-scoring'
import { useToast } from "@/components/ui/use-toast"

export default function MatchPageClient({ id }) {
  const router = useRouter()
  const { toast } = useToast()
  const [match, setMatch] = useState(null)

  useEffect(() => {
    // In a real app, fetch match data from an API
    const fetchMatch = async () => {
      // Simulating API call
      const matchData = {
        id,
        teamA: { name: 'Team A', score: 0, pins: 0 },
        teamB: { name: 'Team B', score: 0, pins: 0 },
        date: new Date().toISOString(),
      }
      setMatch(matchData)
    }

    fetchMatch()
  }, [id])

  const handleSaveMatch = (updatedMatch) => {
    // In a real app, send this data to an API
    console.log('Saving match:', updatedMatch)
    toast({
      title: "Match Saved",
      description: "The match data has been successfully saved.",
    })
    router.push('/calendar')
  }

  if (!match) return <div>Loading...</div>

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Match Scoring</h1>
        <MatchScoring match={match} onSave={handleSaveMatch} />
      </main>
    </div>
  )
}