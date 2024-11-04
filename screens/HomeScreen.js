// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Button, Text, FlatList, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [projects, setProjects] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Load projects when the app starts
  useEffect(() => {
    const loadProjects = async () => {
      const storedProjects = await AsyncStorage.getItem('projects');
      if (storedProjects) setProjects(JSON.parse(storedProjects));
    };
    loadProjects();
  }, []);

  const addProject = async () => {
    if (newProjectName.trim().length === 0) return; // Avoid adding empty names
    const newProject = { id: projects.length + 1, name: newProjectName };
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
    setNewProjectName('');
    setModalVisible(false);
  };

  const deleteProject = async (id) => {
    const updatedProjects = projects.filter((project) => project.id !== id);
    setProjects(updatedProjects);
    await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteProject(id) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button title="Create Project" onPress={() => setModalVisible(true)} />
      
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.projectItemContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('ProjectCalendar', { projectId: item.id })}>
              <Text style={styles.projectItem}>{item.name}</Text>
            </TouchableOpacity>
            <Button title="Delete" color="red" onPress={() => confirmDelete(item.id)} />
          </View>
        )}
      />

      {/* Modal for creating a new project */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            <TextInput
              placeholder="Enter Project Name"
              value={newProjectName}
              onChangeText={setNewProjectName}
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
              <Button title="Create" onPress={addProject} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  projectItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  projectItem: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
