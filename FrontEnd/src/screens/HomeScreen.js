import React, { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/globalStyles";
// 🔌 Import your live fetch helper instead of mock states
import { fetchGrievances } from "../api/api";

export default function HomeScreen({ navigate, setSharedLocation }) {
  const [userLocation, setUserLocation] = useState(null);
  const [issues, setIssues] = useState([]); // Default to empty array until DB answers
  const [loading, setLoading] = useState(true);

  // 🎯 Temporary Local Upvote tracking fallback until global upvote system is wired up
  const handleLocalUpvote = (id) => {
    console.log("Grievance upvoted locally on HomeScreen with ID:", id);
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
        setSharedLocation(regionCoords); // Update root-level application location data
      }

      // 2. Fetch live grievance records from your Java Spring Boot Server
      const liveData = await fetchGrievances();
      setIssues(liveData);

      setLoading(false);
    })();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
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

      <View style={styles.heroTextGroup}>
        <Text style={styles.mainTitleText}>Hello, Citizen!</Text>
        <Text style={styles.subTitleText}>File or Track Your Concerns.</Text>
      </View>

      <Text
        style={[
          styles.locationTitleText,
          { marginHorizontal: 20, marginBottom: 8, color: "#fff" },
        ]}
      >
        Nearby Issues Area:
      </Text>

      {/* 🗺️ Live Database Map Preview Container Layout Card (Using View instead of TouchableOpacity) */}
      <View
        style={[
          styles.glassCardBase,
          { height: 220, overflow: "hidden", padding: 0, marginHorizontal: 20 },
        ]}
      >
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
            scrollEnabled={true}
            zoomEnabled={true}
            pitchEnabled={false}
            rotateEnabled={false}
          >
            {/* 🟢 SAFE USER LOCATION PIN: Verifies valid coordinates are present before mounting */}
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

            {/* 🟢 BULLETPROOF DATABASE MAP LOOP */}
            {issues &&
              issues
                .filter((issue) => {
                  if (!issue) return false;
                  const lat = parseFloat(issue.latitude);
                  const lng = parseFloat(issue.longitude);
                  return !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;
                })
                .map((issue) => (
                  <Marker
                    key={issue.id.toString()}
                    coordinate={{
                      latitude: parseFloat(issue.latitude),
                      longitude: parseFloat(issue.longitude),
                    }}
                    // 🎯 FIX 1: Force the native engine to register a hit area
                    onPress={() =>
                      console.log("Native marker hit registered for:", issue.id)
                    }
                    // 🎯 FIX 2: Explicitly tell the map this pin is interactive
                    tappable={true}
                  >
                    {/* 🎯 FIX 3: Wrap the icon inside a styled container to guarantee physical touch dimensions */}
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons
                        name="location"
                        size={32}
                        color={
                          issue.status === "Pending" ? "#ef4444" : "#eab308"
                        }
                      />
                    </View>

                    {/* 💬 Popover Info Callout Card bubble when marker pin clicked */}
                    <Callout
                      tooltip={true}
                      onPress={() => handleLocalUpvote(issue.id)}
                    >
                      {/* 🎯 FIX 4: Force an explicit layout container style directly inside the Callout wrapper */}
                      <View
                        style={[
                          localStyles.calloutCardContainer,
                          { minWidth: 220, minHeight: 95 },
                        ]}
                      >
                        <Text style={localStyles.calloutTitle}>
                          {issue.title}
                        </Text>
                        <Text style={localStyles.calloutDept}>
                          Dept: {issue.department || "General"}
                        </Text>
                        <Text style={localStyles.calloutDesc} numberOfLines={2}>
                          {issue.description}
                        </Text>
                        <View style={localStyles.upvoteRow}>
                          <Ionicons
                            name="thumbs-up-outline"
                            size={14}
                            color="#3b82f6"
                          />
                          <Text style={localStyles.upvoteText}>
                            {" "}
                            Upvotes: {issue.upvotes || 0}
                          </Text>
                        </View>
                      </View>
                    </Callout>
                  </Marker>
                ))}
          </MapView>
        )}

        {/* 🎯 EXPAND VIEW NAVIGATION ROUTING TRIGGER BUTTON */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigate("mapExplorer")}
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            backgroundColor: "rgba(15,23,42,0.95)",
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 6,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 11, fontWeight: "bold" }}>
            Expand Map View ↗
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          styles.primaryActionBtn,
          { marginHorizontal: 20, marginTop: 20 },
        ]}
        onPress={() => navigate("fileGrievance")}
      >
        <Ionicons
          name="add"
          size={18}
          color="#ffffff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.primaryActionBtnText}>
          File New Unique Grievance
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// 🎯 Component-specific local styling container configurations
const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  calloutCardContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    width: 220, // Explicit width is mandatory for Android layout rendering
    minHeight: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  calloutTitle: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#1f2937",
    marginBottom: 2,
  },
  calloutDept: {
    fontSize: 11,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 4,
  },
  calloutDesc: {
    fontSize: 12,
    color: "#4b5563",
    marginBottom: 6,
  },
  upvoteRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  upvoteText: {
    fontSize: 11,
    color: "#3b82f6",
    fontWeight: "600",
  },
});
