import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const login = useAuthStore(s => s.login);

  const handleLogin = async () => {
    if (!username || !password) return Alert.alert('Fill all fields');
    const success = await login(username.trim().toLowerCase(), password);
    if (!success) Alert.alert('Invalid credentials');
  };

 return (
  <View style={styles.container}>
    <Text style={styles.title}>Login</Text>

    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
      <Text style={{ color: 'blue', marginBottom: 30 }}>
        Don't have an account? Sign up
      </Text>
    </TouchableOpacity>
 
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ddd', padding: 15, borderRadius: 8, marginBottom: 15 },
  button: { backgroundColor: '#0066ff', padding: 15, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});