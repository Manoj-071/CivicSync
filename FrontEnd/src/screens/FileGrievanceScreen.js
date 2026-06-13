import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { createGrievance } from "../api/api";

export default function FileGrievanceScreen({ navigate, userLocation }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // 🎯 Track the numeric ID instead of just a raw string
  const [selectedDeptId, setSelectedDeptId] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [targetLocation, setTargetLocation] = useState(
    userLocation
      ? { latitude: userLocation.latitude, longitude: userLocation.longitude }
      : { latitude: 11.75, longitude: 79.55 },
  );

  // 🔌 Match your exact database rows 1 through 8
  const departments = [
    { id: 1, name: "Sanitation" },
    { id: 2, name: "Electricity" },
    { id: 4, name: "Roads & Bridges" }, // Maps precisely to ID 4
    { id: 3, name: "Water Supply" },
    { id: 5, name: "Public Health" },
    { id: 6, name: "Education" },
    { id: 7, name: "Transport" },
    { id: 8, name: "Sewage & Drains" },
  ];

  const handleSubmit = async () => {
    if (!title || !description) {
      return Alert.alert(
        "Missing Fields",
        "Please complete all text entry summaries before broadcasting.",
      );
    }

    setSubmitting(true);

    const selectedDept = departments.find(d => d.id === selectedDeptId);

    // 🎯 PAYLOAD ALIGNMENT: Matches your com.civicsync.CivicSync_Backend.entity.Grievance properties
    const grievanceData = {
      title,
      description,
      departmentId: selectedDeptId, // Send numeric ID directly to Spring Boot
      category: selectedDept ? selectedDept.name : "Sanitation",
      latitude: targetLocation.latitude,
      longitude: targetLocation.longitude,
    };

    try {
      await createGrievance(grievanceData);

      Alert.alert(
        "Grievance Lodged",
        "Your issue is now active on regional map dashboards.",
        [{ text: "OK", onPress: () => navigate("home") }],
      );
    } catch (error) {
      Alert.alert(
        "Submission Failed",
        "Could not send issue to backend server. Make sure your Java application is active.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={["#103e4b", "#07161b"]} style={{ flex: 1 }}>
      <View style={localStyles.headerRow}>
        <TouchableOpacity onPress={() => navigate("home")}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={localStyles.heading}>File Grievance</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <TextInput
          style={localStyles.input}
          placeholder="Grievance Title Summary"
          placeholderTextColor="#94a3b8"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[localStyles.input, { height: 90 }]}
          multiline
          placeholder="Provide absolute situation details..."
          placeholderTextColor="#94a3b8"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={localStyles.subLabel}>Target Department Sector:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 15 }}
        >
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept.id.toString()}
              style={[
                localStyles.deptTag,
                selectedDeptId === dept.id && localStyles.activeDeptTag,
              ]}
              onPress={() => setSelectedDeptId(dept.id)}
            >
              <Text style={{ color: "#fff", fontSize: 12 }}>{dept.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={localStyles.subLabel}>
          Adjust Pin onto exact Target Boundary Location:
        </Text>
        <View style={localStyles.mapWrapper}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: targetLocation.latitude,
              longitude: targetLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onPress={(e) => setTargetLocation(e.nativeEvent.coordinate)}
          >
            <Marker
              draggable
              coordinate={targetLocation}
              title="Grievance Location"
              description="Drag me or tap the map to change location"
              onDragEnd={(e) => setTargetLocation(e.nativeEvent.coordinate)}
            />
          </MapView>
        </View>

        <TouchableOpacity
          style={localStyles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
              Broadcast Grievance
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  heading: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: 12,
    color: "#fff",
    marginBottom: 14,
    borderColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
  },
  subLabel: {
    color: "#a5f3fc",
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 13,
  },
  deptTag: {
    backgroundColor: "#334155",
    padding: 10,
    borderRadius: 20,
    marginRight: 8,
    height: 38,
    justifyContent: "center",
  },
  activeDeptTag: { backgroundColor: "#319795" },
  mapWrapper: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: "#319795",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    minHeight: 50,
    justifyContent: "center",
  },
});