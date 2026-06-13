import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/globalStyles";
import { fetchGrievances } from "../api/api";

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigate, setSharedLocation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [issues, setIssues] = useState([]); 
  const [loading, setLoading] = useState(true);

  const handleLocalUpvote = (id) => {
    console.log("Grievance upvoted locally on HomeScreen with ID:", id);
    // Optimistic local UI update loop
    setIssues(prevIssues =>
      prevIssues.map(issue =>
        issue.id === id ? { ...issue, upvotes: (issue.upvotes || 0) + 1 } : issue
      )
    );
  };

  useEffect(() => {
    (async () => {
      // 1. Fetch live coordinates from device GPS sensors
      let { status } = await Location.requestForegroundPermissionsAsync();
      let regionCoords = null;

      if (status === "granted") {
        let loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        regionCoords = {
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        };
        setUserLocation(regionCoords);
        setSharedLocation(regionCoords); 
      }

      // 2. Fetch live grievance records from Java Spring Boot Server
      const liveData = await fetchGrievances();
      
      // 🎯 Standardize PostGIS Geometry Point [Lng, Lat] format to flat keys for React Native
      const standardizedData = (liveData || []).map(issue => {
        let issueLat = 0;
        let issueLng = 0;

        if (issue.locationPin && issue.locationPin.coordinates) {
          issueLng = issue.locationPin.coordinates[0]; 
          issueLat = issue.locationPin.coordinates[1]; 
        } else if (issue.latitude && issue.longitude) {
          issueLat = issue.latitude;
          issueLng = issue.longitude;
        }

        return {
          ...issue,
          latitude: issueLat,
          longitude: issueLng,
        };
      });

      setIssues(standardizedData);
      setLoading(false);
    })();
  }, []);

  // Filter out records without valid spatial data points
  const validIssues = issues.filter((issue) => {
    if (!issue) return false;
    const lat = parseFloat(issue.latitude);
    const lng = parseFloat(issue.longitude);
    return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: "#0f172a", paddingBottom: 40 }]}
    >
      {/* Search Header Area */}
      <View style={styles.searchHeaderRow}>
        <View style={styles.searchBarField}>
          <Ionicons
            name="search"
            size={18}
            color="#94a3b8"
            style={{ marginRight: 8 }}
          />
          <TextInput
            placeholder="Quick Search"
            placeholderTextColor="#94a3b8"
            style={styles.textInputStyle}
          />
        </View>
        <TouchableOpacity
          style={styles.headerProfileCircle}
          onPress={() => navigate("account")}
        >
          <Ionicons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Hero Welcome Info */}
      <View style={styles.heroTextGroup}>
        <Text style={styles.mainTitleText}>Hello, Citizen!</Text>
        <Text style={styles.subTitleText}>File or Track Your Concerns.</Text>
      </View>

      <Text style={[styles.locationTitleText, { marginHorizontal: 20, marginBottom: 8, color: "#fff" }]}>
        Nearby Issues Map Area:
      </Text>

      {/* 🗺️ Map Container Layout Card */}
      <View style={[styles.glassCardBase, { height: 220, overflow: "hidden", padding: 0, marginHorizontal: 20 }]}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ffffff"
            style={{ flex: 1, justifyContent: "center" }}
          />
        ) : (
          <MapView
            provider={PROVIDER_DEFAULT}
            style={{ flex: 1 }}
            region={
              userLocation || {
                latitude: 11.75,
                longitude: 79.55,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            }
          >
            {userLocation?.latitude && userLocation?.longitude && (
              <Marker
                coordinate={{
                  latitude: parseFloat(userLocation.latitude),
                  longitude: parseFloat(userLocation.longitude),
                }}
                title="Your Location"
              >
                <Ionicons name="navigate-circle" size={36} color="#3b82f6" />
              </Marker>
            )}

            {validIssues.map((issue) => (
              <Marker
                key={issue.id.toString()}
                coordinate={{
                  latitude: parseFloat(issue.latitude),
                  longitude: parseFloat(issue.longitude),
                }}
                tappable={true}
              >
                <View style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
                  <Ionicons
                    name="location"
                    size={32}
                    color={issue.status === "Pending" ? "#ef4444" : "#eab308"}
                  />
                </View>

                <Callout tooltip={true} onPress={() => handleLocalUpvote(issue.id)}>
                  <View style={[localStyles.calloutCardContainer, { minWidth: 220, minHeight: 95 }]}>
                    <Text style={localStyles.calloutTitle}>{issue.title}</Text>
                    <Text style={localStyles.calloutDept}>Dept: {issue.category || issue.department || "General"}</Text>
                    <Text style={localStyles.calloutDesc} numberOfLines={2}>{issue.description}</Text>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigate("mapExplorer")}
          style={localStyles.expandMapBtn}
        >
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>Expand Map View ↗</Text>
        </TouchableOpacity>
      </View>

      {/* 🎯 NEW: LIVE FEED CARDS CONTAINER ROW */}
      <Text style={[styles.locationTitleText, { marginHorizontal: 20, marginTop: 24, marginBottom: 12, color: "#fff" }]}>
        Active Live Feed Issues:
      </Text>

      <View style={{ paddingHorizontal: 20 }}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffffff" style={{ marginVertical: 20 }} />
        ) : validIssues.length === 0 ? (
          <View style={localStyles.emptyFeedContainer}>
            <Ionicons name="checkmark-circle-outline" size={40} color="#64748b" />
            <Text style={localStyles.emptyFeedText}>All clear! No open local issues found.</Text>
          </View>
        ) : (
          validIssues.map((issue) => (
            <View key={issue.id.toString()} style={localStyles.feedCard}>
              <View style={localStyles.cardHeader}>
                <View style={[localStyles.statusBadge, { backgroundColor: issue.status === "Pending" ? "rgba(239,68,68,0.2)" : "rgba(234,179,8,0.2)" }]}>
                  <Text style={[localStyles.statusText, { color: issue.status === "Pending" ? "#f87171" : "#facc15" }]}>
                    {issue.status}
                  </Text>
                </View>
                <Text style={localStyles.cardCategory}>{issue.category || issue.department || "General"}</Text>
              </View>

              <Text style={localStyles.cardTitle}>{issue.title}</Text>
              <Text style={localStyles.cardDesc} numberOfLines={3}>{issue.description}</Text>

              <View style={localStyles.cardFooterDivider} />

              <View style={localStyles.cardFooterRow}>
                <TouchableOpacity 
                  style={localStyles.upvoteButton} 
                  onPress={() => handleLocalUpvote(issue.id)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="heart" size={18} color="#ef4444" />
                  <Text style={localStyles.upvoteButtonText}>Upvote ({issue.upvotes || 0})</Text>
                </TouchableOpacity>

                <View style={localStyles.locationRow}>
                  <Ionicons name="location-outline" size={14} color="#94a3b8" />
                  <Text style={localStyles.locationCoordsText}>
                    {parseFloat(issue.latitude).toFixed(4)}, {parseFloat(issue.longitude).toFixed(4)}
                  </Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity
        style={[styles.primaryActionBtn, { marginHorizontal: 20, marginTop: 24 }]}
        onPress={() => navigate("fileGrievance")}
      >
        <Ionicons name="add" size={18} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.primaryActionBtnText}>File New Unique Grievance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const localStyles = StyleSheet.create({
  calloutCardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    width: 220,
    minHeight: 90,
    elevation: 5,
  },
  calloutTitle: { fontWeight: "bold", fontSize: 14, color: "#1f2937", marginBottom: 2 },
  calloutDept: { fontSize: 11, fontWeight: "600", color: "#2563eb", marginBottom: 4 },
  calloutDesc: { fontSize: 12, color: "#4b5563" },
  expandMapBtn: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(15,23,42,0.95)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
  },
  /* 🎯 STYLING FOR THE NEW LIVE FEED COMPLAINT CARDS */
  feedCard: {
    backgroundColor: "rgba(30, 41, 59, 0.7)", 
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "between",
    alignItems: "center",
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  cardCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3b82f6",
    marginLeft: "auto",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooterDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    marginBottom: 12,
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  upvoteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  upvoteButtonText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationCoordsText: {
    color: "#64748b",
    fontSize: 11,
    marginLeft: 4,
    fontFamily: "monospace",
  },
  emptyFeedContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  emptyFeedText: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 8,
  },
});