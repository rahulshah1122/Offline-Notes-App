import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { useNotesStore, Note } from '../store/notesStore';
import { useFocusEffect } from '@react-navigation/native';

export default function NotesScreen({ navigation }: any) {
  const { currentUser, logout } = useAuthStore();
  const { notes, loadNotes, deleteNote } = useNotesStore();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    if (currentUser) await loadNotes(currentUser);
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [currentUser])
  );

  const filteredAndSorted = () => {
    let result = [...notes];

    // Search
    if (search) {
      const lower = search.toLowerCase();
      result = result.filter(
        n => n.title.toLowerCase().includes(lower) || n.body.toLowerCase().includes(lower)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sort === 'newest') return b.updatedAt - a.updatedAt;
      if (sort === 'oldest') return a.updatedAt - b.updatedAt;
      if (sort === 'az') return a.title.localeCompare(b.title);
      if (sort === 'za') return b.title.localeCompare(a.title);
      return 0;
    });

    return result;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Sure?', [
      { text: 'Cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => currentUser && deleteNote(currentUser, id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes ({currentUser})</Text>
        <TouchableOpacity onPress={logout}>
          <Text style={{ color: 'red', fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.search}
        placeholder="Search notes..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.sortRow}>
        <Text>Sort:</Text>
        {(['newest', 'oldest', 'az', 'za'] as const).map(s => (
          <TouchableOpacity key={s} onPress={() => setSort(s)} style={sort === s ? styles.activeSort : styles.sortBtn}>
            <Text>{s === 'newest' ? 'New' : s === 'oldest' ? 'Old' : s === 'az' ? 'A-Z' : 'Z-A'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredAndSorted()}
        keyExtractor={item => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50 }}>No notes yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteCard}
            onPress={() => navigation.navigate('EditNote', { noteId: item.id })}
          >
            {item.imageUri && (
              <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>{item.title || 'Untitled'}</Text>
              <Text numberOfLines={2} style={styles.preview}>
                {item.body || 'No content'}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('EditNote', { noteId: null })}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold' },
  search: { margin: 15, padding: 12, backgroundColor: '#fff', borderRadius: 8, borderWidth: 1, borderColor: '#ddd' },
  sortRow: { flexDirection: 'row', paddingHorizontal: 15, gap: 10, marginBottom: 10 },
  sortBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  activeSort: { backgroundColor: '#0066ff', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  noteCard: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 15, marginVertical: 6, padding: 12, borderRadius: 10, alignItems: 'center' },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  noteTitle: { fontSize: 16, fontWeight: 'bold' },
  preview: { color: '#666', marginTop: 4 },
  fab: { position: 'absolute', right: 20, bottom: 30, backgroundColor: '#0066ff', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  fabText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
});