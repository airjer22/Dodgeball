import { collection, addDoc, updateDoc, deleteDoc, doc, getDoc, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from './firebase';

export const createTournament = async (tournamentData) => {
  try {
    const docRef = await addDoc(collection(db, 'tournaments'), tournamentData);
    return docRef;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw new Error("Failed to create tournament. Please try again.");
  }
};

export const getTournament = async (id) => {
  try {
    const tournamentDoc = await getDoc(doc(db, 'tournaments', id));
    if (tournamentDoc.exists()) {
      return { id: tournamentDoc.id, ...tournamentDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching tournament:", error);
    throw new Error("Failed to fetch tournament. Please try again.");
  }
};

export const getAllTournaments = async () => {
  try {
    const tournamentsRef = collection(db, 'tournaments');
    const querySnapshot = await getDocs(tournamentsRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tournaments:", error);
    throw new Error("Failed to fetch tournaments. Please try again.");
  }
};

export const updateTournament = async (id, tournamentData) => {
  try {
    await updateDoc(doc(db, 'tournaments', id), tournamentData);
  } catch (error) {
    console.error("Error updating tournament:", error);
    throw new Error("Failed to update tournament. Please try again.");
  }
};

export const deleteTournament = async (id) => {
  try {
    await deleteDoc(doc(db, 'tournaments', id));
  } catch (error) {
    console.error("Error deleting tournament:", error);
    throw new Error("Failed to delete tournament. Please try again.");
  }
};

export const createTeam = async (teamData) => {
  try {
    const docRef = await addDoc(collection(db, 'teams'), teamData);
    return docRef;
  } catch (error) {
    console.error("Error creating team:", error);
    throw new Error("Failed to create team. Please try again.");
  }
};

export const getTeamsByTournament = async (tournamentId) => {
  try {
    const teamsQuery = query(collection(db, 'teams'), where('tournamentId', '==', tournamentId));
    const querySnapshot = await getDocs(teamsQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching teams:", error);
    throw new Error("Failed to fetch teams. Please try again.");
  }
};

export const updateTeam = async (id, teamData) => {
  try {
    await updateDoc(doc(db, 'teams', id), teamData);
  } catch (error) {
    console.error("Error updating team:", error);
    throw new Error("Failed to update team. Please try again.");
  }
};

export const createMatch = async (matchData) => {
  try {
    const docRef = await addDoc(collection(db, 'matches'), matchData);
    return docRef;
  } catch (error) {
    console.error("Error creating match:", error);
    throw new Error("Failed to create match. Please try again.");
  }
};

export const getMatchesByTournament = async (tournamentId) => {
  try {
    const matchesQuery = query(collection(db, 'matches'), where('tournamentId', '==', tournamentId));
    const querySnapshot = await getDocs(matchesQuery);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching matches:", error);
    throw new Error("Failed to fetch matches. Please try again.");
  }
};

export const updateMatch = async (id, matchData) => {
  try {
    await updateDoc(doc(db, 'matches', id), matchData);
  } catch (error) {
    console.error("Error updating match:", error);
    throw new Error("Failed to update match. Please try again.");
  }
};

export const getMatch = async (id) => {
  try {
    const matchDoc = await getDoc(doc(db, 'matches', id));
    if (matchDoc.exists()) {
      return { id: matchDoc.id, ...matchDoc.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching match:", error);
    throw new Error("Failed to fetch match. Please try again.");
  }
};