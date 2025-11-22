import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../store/authStore';
import { useNotesStore, Note } from '../store/notesStore';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function NoteEditScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { currentUser } = useAuthStore();
  const { notes, addNote, updateNote } = useNotesStore();
  const noteId = route.params?.noteId || null;

  const existingNote = notes.find(n => n.id === noteId);

  const [title, setTitle] = useState(existingNote?.title || '');
  const [body, setBody] = useState(existingNote?.body || '');
  const [imageUri, setImageUri] = useState<string | undefined>(existingNote?.imageUri);

  const pickImage = async (fromCamera: boolean) => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return Alert.alert('Permission required');

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const saveNote = async () => {
    if (!currentUser) return;

    const noteData = {
      title: title.trim() || 'New Note',
      body: body.trim(),
      imageUri,
    };

    if (noteId) {
      await updateNote(currentUser, noteId, noteData);
    } else {
      await addNote(currentUser, noteData);
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.titleInput} value={title} onChangeText={setTitle} placeholder="Enter title" />

      <Text style={styles.label}>Body</Text>
      <TextInput
        style={styles.bodyInput}
        value={body}
        onChangeText={setBody}
        placeholder="Write something..."
        multiline
      />

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <View style={styles.imageButtons}>
        <TouchableOpacity style={styles.imgBtn} onPress={() => pickImage(false)}>
          <Text style={styles.imgBtnText}>Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imgBtn} onPress={() => pickImage(true)}>
          <Text style={styles.imgBtnText}>Camera</Text>
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity style={[styles.imgBtn, { backgroundColor: 'red' }]} onPress={() => setImageUri(undefined)}>
            <Text style={styles.imgBtnText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={saveNote}>
        <Text style={styles.saveText}>Save Note</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 20, marginBottom: 8 },
  titleInput: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8 },
  bodyInput: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 8, height: 200, textAlignVertical: 'top' },
  image: { width: '100%', height: 250, borderRadius: 10, marginVertical: 20 },
  imageButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  imgBtn: { backgroundColor: '#0066ff', padding: 12, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  imgBtnText: { color: '#fff', fontWeight: '600' },
  saveBtn: { backgroundColor: '#00aa00', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  saveText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});