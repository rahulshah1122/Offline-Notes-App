import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Note {
  id: string;
  title: string;
  body: string;
  imageUri?: string;
  updatedAt: number;
}

interface NotesStore {
  notes: Note[];
  loadNotes: (username: string) => Promise<void>;
  addNote: (username: string, note: Omit<Note, 'id' | 'updatedAt'>) => Promise<void>;
  updateNote: (username: string, id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (username: string, id: string) => Promise<void>;
}

const getKey = (username: string) => `@notes_${username}`;

export const useNotesStore = create<NotesStore>((set, get) => ({
  notes: [],

  loadNotes: async (username) => {
    const json = await AsyncStorage.getItem(getKey(username));
    const notes = json ? JSON.parse(json) : [];
    set({ notes });
  },

  addNote: async (username, noteData) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      updatedAt: Date.now(),
    };
    const { notes } = get();
    const updated = [...notes, newNote];
    await AsyncStorage.setItem(getKey(username), JSON.stringify(updated));
    set({ notes: updated });
  },

  updateNote: async (username, id, updates) => {
    const { notes } = get();
    const updated = notes.map(n =>
      n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
    );
    await AsyncStorage.setItem(getKey(username), JSON.stringify(updated));
    set({ notes: updated });
  },

  deleteNote: async (username, id) => {
    const { notes } = get();
    const updated = notes.filter(n => n.id !== id);
    await AsyncStorage.setItem(getKey(username), JSON.stringify(updated));
    set({ notes: updated });
  },
}));