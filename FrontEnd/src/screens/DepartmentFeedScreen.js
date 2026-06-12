import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 🎯 Import storage engine
import { Ionicons } from '@expo/vector-icons';
import { styles, colors } from '../styles/globalStyles';
import { fetchGrievances } from '../api/api';

export default function DepartmentFeedScreen({ route, navigation, ...props }) {
  const [categoryName, setCategoryName] = useState("Department");
  const [nearbyTickets, setNearbyTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDataAndFilter = async () => {
      try {
        setLoading(true);
        
        // 1. Get the department selection value saved by the previous screen click event
        let selectedDept = route?.params?.categoryName || props?.categoryName;
        
        if (!selectedDept) {
          selectedDept = await AsyncStorage.getItem('SELECTED_DEPT_NAME');
        }
        
        const finalDeptName = selectedDept || "Sanitation";
        setCategoryName(finalDeptName);
        
        console.log(`🚀 AsyncStorage successfully fetched choice: "${finalDeptName}"`);

        // 2. Query your Spring Boot backend service
        const masterDatabaseDump = await fetchGrievances();
        
        // 3. Complete string-to-string case-insensitive match filter mapping
        const filteredResults = (masterDatabaseDump || []).filter(ticket => {
          let ticketDeptString = "";

          if (typeof ticket.department === 'string') {
            ticketDeptString = ticket.department;
          } else if (ticket.department && typeof ticket.department === 'object') {
            ticketDeptString = ticket.department.name || "";
          }

          return ticketDeptString.trim().toLowerCase() === finalDeptName.trim().toLowerCase();
        });

        console.log(`🎯 Filter matched ${filteredResults.length} records for: "${finalDeptName}"`);
        setNearbyTickets(filteredResults);
        
      } catch (error) {
        console.error("Failed loading data routing components:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDataAndFilter();
  }, []);

  const handleBackPress = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    } else if (props.navigate) {
      props.navigate('departments');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#07161b', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a5f3fc" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { backgroundColor: '#07161b' }]}>
      <View style={styles.screenHeaderWithBack}>
        <TouchableOpacity onPress={handleBackPress} style={{ paddingRight: 10 }}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={[styles.centeredScreenTitle, { flex: 1, textTransform: 'uppercase' }]}>{categoryName} FEED</Text>
      </View>

      <Text style={{ color: colors.textSecondary, fontSize: 13, marginBottom: 20, fontWeight: '500', paddingHorizontal: 4 }}>
        Displaying civic incidents active under the <Text style={{ color: colors.accent }}>{categoryName}</Text> branch structure.
      </Text>

      {nearbyTickets.length === 0 ? (
        <View style={{ marginTop: 60, alignItems: 'center', paddingHorizontal: 20 }}>
          <Ionicons name="checkmark-circle-outline" size={50} color="#4ade80" style={{ marginBottom: 12 }} />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600', textAlign: 'center' }}>All Clear!</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 13, textAlign: 'center', marginTop: 4, opacity: 0.8 }}>
            No active {categoryName.toLowerCase()} issues have been found in the live registry.
          </Text>
        </View>
      ) : (
        nearbyTickets.map((ticket) => {
          const dynamicColor = ticket.status === "Pending" || ticket.status === "PENDING" ? "#ef4444" : ticket.status === "Solved" || ticket.status === "SOLVED" ? "#4ade80" : "#fbbf24";
          
          return (
            <View key={ticket.id.toString()} style={styles.ticketCardBase}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.ticketRefNumber}>
                  Reference: {ticket.ticketNumber || `CR-${ticket.id}`}
                </Text>
                <Text style={{ color: colors.accent, fontSize: 12, fontWeight: '600' }}>📍 Active Tracker</Text>
              </View>
              
              <Text style={[styles.ticketStatusText, { color: dynamicColor, marginTop: 4 }]}>
                Status: {ticket.status || "Pending"}
              </Text>
              
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: (ticket.status === 'Solved' || ticket.status === 'SOLVED') ? '100%' : '40%', backgroundColor: dynamicColor }]} />
              </View>
              
              <Text style={styles.ticketDetailsAddress}>{ticket.title}</Text>
              <Text style={[styles.ticketDateStamp, { color: '#94a3b8' }]}>{ticket.description}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}