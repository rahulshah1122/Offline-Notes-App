import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@users';
const CURRENT_USER_KEY = '@current_user';

interface User {
  username: string;
  password: string;
}

interface AuthStore {
  currentUser: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loadCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  currentUser: null,

  loadCurrentUser: async () => {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (user) set({ currentUser: user });
  },

  login: async (username, password) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    if (users[username]?.password === password) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, username);
      set({ currentUser: username });
      return true;
    }
    return false;
  },

  signup: async (username, password) => {
    const usersJson = await AsyncStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : {};
    if (users[username]) return false;
    users[username] = { password };
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, username);
    set({ currentUser: username });
    return true;
  },

  logout: async () => {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    set({ currentUser: null });
  },
}));