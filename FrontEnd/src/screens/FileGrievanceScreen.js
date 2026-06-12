import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
// 🔌 Injected live database API connector function from your new file
import { createGrievance } from '../api/api';

export default function FileGrievanceScreen({ navigate, userLocation }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDept, setSelectedDept] = useState('Sanitation');
  const [submitting, setSubmitting] = useState(false); // Handles button spinner state
  const [targetLocation, setTargetLocation] = useState(
    userLocation ? { latitude: userLocation.latitude, longitude: userLocation.longitude } : { latitude: 11.7500, longitude: 79.5500 }
  );

  const departments = ['Sanitation', 'Electricity', 'Water Supply', 'Roadways', 'Public Safety'];

  const handleSubmit = async () => {
    if (!title || !description) {
      return Alert.alert("Missing Fields", "Please complete all text entry summaries before broadcasting.");
    }

    setSubmitting(true);

    const grievanceData = {
      title,
      description,
      department: selectedDept,
      latitude: targetLocation.latitude,
      longitude: targetLocation.longitude,
    };

    try {
      // 📡 Transmit directly to your Spring Boot database server over the network!
      await createGrievance(grievanceData);
      
      Alert.alert("Grievance Lodged", "Your issue is now active on regional map dashboards.", [
        { text: "OK", onPress: () => navigate('home') }
      ]);
    } catch (error) {
      Alert.alert("Submission Failed", "Could not send issue to backend server. Make sure your Java application is active.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={['#103e4b', '#07161b']} style={{ flex: 1 }}>
      <View style={localStyles.headerRow}>
        <TouchableOpacity onPress={() => navigate('home')}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={localStyles.heading}>File Grievance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TextInput style={localStyles.input} placeholder="Grievance Title Summary" placeholderTextColor="#94a3b8" value={title} onChangeText={setTitle} />
        <TextInput style={[localStyles.input, { height: 90 }]} multiline placeholder="Provide absolute situation details..." placeholderTextColor="#94a3b8" value={description} onChangeText={setDescription} />

        <Text style={localStyles.subLabel}>Target Department Sector:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
          {departments.map(dept => (
            <TouchableOpacity 
              key={dept} 
              style={[localStyles.deptTag, selectedDept === dept && localStyles.activeDeptTag]} 
              onPress={() => setSelectedDept(dept)}
            >
              <Text style={{ color: '#fff', fontSize: 12 }}>{dept}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={localStyles.subLabel}>Adjust Pin onto exact Target Boundary Location:</Text>
<View style={localStyles.mapWrapper}>
  <MapView 
    style={{ flex: 1 }} 
    initialRegion={{
      latitude: targetLocation.latitude,
      longitude: targetLocation.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }}
    // 🎯 FIX: Allows tapping anywhere on the map grid to change coordinates dynamically
    onPress={(e) => setTargetLocation(e.nativeEvent.coordinate)}
  >
    <Marker 
      draggable 
      coordinate={targetLocation} 
      title="Grievance Location"
      description="Drag me or tap the map to change location"
      // 🔄 Keeps state synchronized when dragging stops
      onDragEnd={(e) => setTargetLocation(e.nativeEvent.coordinate)}
    />
  </MapView>
</View>

        <TouchableOpacity style={localStyles.submitBtn} onPress={handleSubmit} disabled={submitting}>
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Broadcast Grievance</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  // 🛠️ Changed 'between' to 'space-between' to fix React Native crashing layout rules
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 },
  heading: { color: '#fff', fontSize: 20, fontWeight: 'bold', textAlign: 'center', flex: 1 },
  input: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: 12, color: '#fff', marginBottom: 14, borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 },
  subLabel: { color: '#a5f3fc', marginBottom: 8, fontWeight: '600', fontSize: 13 },
  deptTag: { backgroundColor: '#334155', padding: 10, borderRadius: 20, marginRight: 8, height: 38 },
  activeDeptTag: { backgroundColor: '#319795' },
  mapWrapper: { height: 200, borderRadius: 12, overflow: 'hidden', marginBottom: 20 },
  submitBtn: { backgroundColor: '#319795', padding: 14, borderRadius: 10, alignItems: 'center', minHeight: 50, justifyContent: 'center' }
});