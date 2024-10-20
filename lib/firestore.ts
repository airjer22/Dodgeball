import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

// Tournament operations
export const createTournament = async (tournamentData) => {
  return await addDoc(collection(db, 'tournaments'), tournamentData);
};

export const updateTournament = async (tournamentId, tournamentData) => {
  const tournamentRef = doc(db, 'tournaments', tournamentId);
  await updateDoc(tournamentRef, tournamentData);
};

export const deleteTournament = async (tournamentId) => {
  await deleteDoc(doc(db, 'tournaments', tournamentId));
};

export const getTournament = async (tournamentId) => {
  const tournamentDoc = await getDoc(doc(db, 'tournaments', tournamentId));
  return tournamentDoc.exists() ? { id: tournamentDoc.id, ...tournamentDoc.data() } : null;
};

export const getAllTournaments = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tournaments'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting all tournaments:", error);
    throw error;
  }
};

// Team operations
export const createTeam = async (teamData) => {
  return await addDoc(collection(db, 'teams'), teamData);
};

export const updateTeam = async (teamId, teamData) => {
  const teamRef = doc(db, 'teams', teamId);
  await updateDoc(teamRef, teamData);
};

export const deleteTeam = async (teamId) => {
  await deleteDoc(doc(db, 'teams', teamId));
};

export const getTeam = async (teamId) => {
  const teamDoc = await getDoc(doc(db, 'teams', teamId));
  return teamDoc.exists() ? { id: teamDoc.id, ...teamDoc.data() } : null;
};

export const getTeamsByTournament = async (tournamentId) => {
  const q = query(collection(db, 'teams'), where('tournamentId', '==', tournamentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Match operations
export const createMatch = async (matchData) => {
  return await addDoc(collection(db, 'matches'), matchData);
};

export const updateMatch = async (matchId, matchData) => {
  const matchRef = doc(db, 'matches', matchId);
  await updateDoc(matchRef, matchData);
};

export const deleteMatch = async (matchId) => {
  await deleteDoc(doc(db, 'matches', matchId));
};

export const getMatch = async (matchId) => {
  const matchDoc = await getDoc(doc(db, 'matches', matchId));
  return matchDoc.exists() ? { id: matchDoc.id, ...matchDoc.data() } : null;
};

export const getMatchesByTournament = async (tournamentId) => {
  const q = query(collection(db, 'matches'), where('tournamentId', '==', tournamentId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data(),
    winner: doc.data().winner || null // Ensure winner field is always present
  }));
};

export const updateMatchSchedule = async (matchId, scheduledDate) => {
  const matchRef = doc(db, 'matches', matchId);
  await updateDoc(matchRef, { scheduledDate });
};