import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../styles/globalStyles";
// 🔌 Import your live network helper instead of the old mock data layout
import { fetchGrievances } from "../api/api";

export default function MapExplorerScreen({ navigate, userLocation }) {
  const [issues, setIssues] = useState([]); // Default to empty array for DB records
  const [mapLoading, setMapLoading] = useState(true);

  // 🔄 Fetch all real-time complaints from your Java backend when screen loads
  useEffect(() => {
    async function loadMapData() {
      try {
        const liveIssues = await fetchGrievances();
        setIssues(liveIssues);
      } catch (error) {
        console.error("Map data load error:", error);
        Alert.alert(
          "Data Sync Issue",
          "Could not load active pins from the regional database server.",
        );
      } finally {
        setMapLoading(false);
      }
    }
    loadMapData();
  }, []);

  // 👍 Handle upvotes locally in state engine for now until we build the backend endpoint
  const handleLocalUpvote = (id) => {
    setIssues((prevIssues) =>
      prevIssues.map((issue) =>
        issue.id === id ? { ...issue, upvotes: issue.upvotes + 1 } : issue,
      ),
    );
  };

  if (mapLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
        <Text style={styles.loadingText}>
          Synchronizing Civic Matrix Map...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🧭 Header Back Navigation Arrow bar */}
      <View style={styles.headerFloatingRow}>
        <TouchableOpacity
          style={styles.backIconButton}
          onPress={() => navigate("home")}
        >
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Regional Explorations</Text>
      </View>

      <MapView
        style={styles.mapElement}
        initialRegion={
          userLocation || {
            latitude: 11.93,
            longitude: 79.49,
            latitudeDelta: 0.07,
            longitudeDelta: 0.07,
          }
        }
      >
        {/* 🔵 Render user position marker pin */}
        {/* 🟢 SAFE USER LOCATION PIN: Verifies valid coordinates are present inside the object before mounting */}
        {userLocation && userLocation.latitude && userLocation.longitude ? (
          <Marker
            coordinate={{
              latitude: parseFloat(userLocation.latitude),
              longitude: parseFloat(userLocation.longitude),
            }}
            title="Your Location"
          >
            <Ionicons name="navigate-circle" size={36} color="#3b82f6" />
          </Marker>
        ) : null}

        {/* 🟢 FIXED ACTIVE DATABASE PINS LOOP */}
        {issues &&
          issues
            .filter(
              (issue) =>
                issue && issue.latitude != null && issue.longitude != null,
            )
            .map((issue) => (
              <Marker
                key={issue.id.toString()}
                coordinate={{
                  latitude: parseFloat(issue.latitude),
                  longitude: parseFloat(issue.longitude),
                }}
              >
                <Ionicons
                  name="location"
                  size={32}
                  color={issue.status === "Pending" ? "#ef4444" : "#eab308"}
                />

                {/* 💬 Popover Info Callout Card bubble when marker pin clicked */}
                <Callout tooltip onPress={() => handleLocalUpvote(issue.id)}>
                  <View style={styles.calloutCardContainer}>
                    <Text style={styles.calloutTitle}>{issue.title}</Text>
                    <Text style={styles.calloutDept}>
                      Dept: {issue.department || "General"}
                    </Text>
                    <Text style={styles.calloutDesc} numberOfLines={2}>
                      {issue.description}
                    </Text>
                    <View style={styles.upvoteRow}>
                      <Ionicons
                        name="thumbs-up-outline"
                        size={14}
                        color="#3b82f6"
                      />
                      <Text style={styles.upvoteText}>
                        {" "}
                        Upvotes: {issue.upvotes || 0}
                      </Text>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { color: "#94a3b8", marginTop: 12, fontSize: 14 },
  mapElement: { flex: 1 },
  headerFloatingRow: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15,23,42,0.85)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  backIconButton: { marginRight: 12 },
  headerTitleText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  calloutCardContainer: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    width: 200,
  },
  calloutTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  calloutDept: {
    color: "#3b82f6",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  calloutDesc: { color: "#94a3b8", fontSize: 12, marginBottom: 6 },
  upvoteRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  upvoteText: { color: "#3b82f6", fontSize: 11, fontWeight: "bold" },
});
