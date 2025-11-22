import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import NotesScreen from './src/screens/NotesScreen';
import NoteEditScreen from './src/screens/NoteEditScreen';
import { useAuthStore } from './src/store/authStore';

const Stack = createNativeStackNavigator();

export default function App() {
  const { currentUser, loadCurrentUser } = useAuthStore();

  useEffect(() => {
    loadCurrentUser();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {currentUser ? (
          <>
            <Stack.Screen name="Notes" component={NotesScreen} />
            <Stack.Screen name="EditNote" component={NoteEditScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}