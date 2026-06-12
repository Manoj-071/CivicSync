import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from '../styles/globalStyles';

export default function DepartmentFeedScreen({ route, navigation }) {
  // 📥 Read the parameter passed from the clicked tile card
  const { category } = route.params;
  
  const [nearbyTickets, setNearbyTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulated user sector location context (e.g., Sector 4)
  const USER_LOCAL_SECTOR = "Sector 4";

  useEffect(() => {
    const fetchNearbyDepartmentTickets = async () => {
      try {
        // 🔮 FUTURE BACKEND IMPLEMENTATION:
        // const response = await fetch(`http://YOUR_IP:8080/api/grievances?category=${category}&sector=${USER_LOCAL_SECTOR}`);
        // const data = await response.json();
        // setNearbyTickets(data);

        // 🛠️ MOCK BACKEND DATA HOOK: Simulated live community database items
        const masterDatabaseDump = [
          { id: "CR-99X1", category: "Sanitation", title: "Commercial garbage dump blocking back-alley", sector: "Sector 4", status: "Under Review", color: "#38bdf8", distance: "0.2 km away" },
          { id: "CR-44L2", category: "Sanitation", title: "Public waste bin overflowing onto sidewalk", sector: "Sector 4", status: "Acknowledged", color: "#fbbf24", distance: "0.5 km away" },
          { id: "CR-11A0", category: "Sanitation", title: "Debris clearing request post construction work", sector: "Sector 12", status: "Solved", color: "#4ade80", distance: "4.1 km away" },
          
          { id: "CR-77P5", category: "Roads & Bridges", title: "Deep pothole cluster forming near main intersection", sector: "Sector 4", status: "Under Review", color: "#38bdf8", distance: "0.1 km away" },
          
          { id: "CR-22W9", category: "Water Supply", title: "Contaminated muddy tap water reports", sector: "Sector 4", status: "Acknowledged", color: "#fbbf24", distance: "0.7 km away" },
          
          { id: "CR-88K4", category: "Sewage & Drains", title: "Open storm drain channel presenting safety hazard", sector: "Sector 4", status: "Under Review", color: "#38bdf8", distance: "0.3 km away" },
        ];

        // 🎯 Logic: Filter records to match the selected category AND target user's local neighborhood sector
        const filteredResults = masterDatabaseDump.filter(
          ticket => ticket.category === category && ticket.sector === USER_LOCAL_SECTOR
        );

        setNearbyTickets(filteredResults);
      } catch (error) {
        console.error("Failed loading community records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNearbyDepartmentTickets();
  }, [category]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#07161b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a5f3fc" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { backgroundColor: '#07161b', flex: 1 }]}>
      {/* Dynamic Header displaying the current category */}
      <View style={styles.screenHeaderWithBack}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.centeredScreenTitle, { flex: 1, textTransform: 'uppercase' }]}>{category} NEAR ME</Text>
      </View>

      <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 20, fontWeight: '500' }}>
        Displaying civic incidents reported within <Text style={{ color: colors.accent }}>{USER_LOCAL_SECTOR}</Text>
      </Text>

      {/* Render Dynamic Filter Results */}
      {nearbyTickets.length === 0 ? (
        <View style={{ marginTop: 60, alignItems: 'center', paddingHorizontal: 20 }}>
          <Ionicons name="checkmark-circle-outline" size={50} color="#4ade80" style={{ marginBottom: 12 }} />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600', textAlign: 'center' }}>All Clear!</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 4, opacity: 0.8 }}>
            No active {category.toLowerCase()} issues have been reported nearby.
          </Text>
        </View>
      ) : (
        nearbyTickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCardBase}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={styles.ticketRefNumber}>ID: {ticket.id}</Text>
              <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '600' }}>📍 {ticket.distance}</Text>
            </View>
            
            <Text style={[styles.ticketStatusText, { color: ticket.color, marginTop: 4 }]}>
              Status: {ticket.status}
            </Text>
            
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: ticket.status === 'Solved' ? '100%' : '40%', backgroundColor: ticket.color }]} />
            </View>
            
            <Text style={styles.ticketDetailsAddress}>{ticket.title}</Text>
            <Text style={[styles.ticketDateStamp, { color: '#94a3b8' }]}>Location Area: {ticket.sector}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}