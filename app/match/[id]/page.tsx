import { Metadata } from 'next'
import MatchPageClient from './match-page-client'

export const generateStaticParams = async () => {
  // In a real app, you would fetch all possible match IDs from your data source
  // For now, we'll return a range of IDs
  return Array.from({ length: 20 }, (_, i) => ({ id: (i + 1).toString() }))
}

export const generateMetadata = async ({ params }): Promise<Metadata> => {
  return {
    title: `Match ${params.id} | Dodgeball Tournament Master`,
  }
}

export default function MatchPage({ params }) {
  return <MatchPageClient id={params.id} />
}