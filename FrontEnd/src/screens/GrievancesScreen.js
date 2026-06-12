import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Entypo } from '@expo/vector-icons';
import { styles, colors } from '../styles/globalStyles';
import { fetchGrievances } from '../api/api'; 

// 🎯 Relational Database ID to Visual Layout Mapping Directory
const DB_DEPARTMENT_MAP = {
  1: { name: "Sanitation", icon: "trash-alt" },
  2: { name: "Electricity", icon: "lightbulb" },
  3: { name: "Water Supply", icon: "faucet" },
  4: { name: "Roads & Bridges", icon: "road" }, // Maps 'Roadways' (ID 4) to UI name
  5: { name: "Public Health", icon: "heartbeat" },
  6: { name: "Education", icon: "graduation-cap" },
  7: { name: "Transport", icon: "bus" },
  8: { name: "Sewage & Drains", icon: "water" }
};

export default function GrievancesScreen() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGrievances = async () => {
      try {
        const masterData = await fetchGrievances();
        setComplaints(masterData || []);
      } catch (error) {
        console.error("Error reading personal records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserGrievances();
  }, []);

  const renderDepartmentIcon = (deptId, iconColor) => {
    const iconName = DB_DEPARTMENT_MAP[deptId]?.icon;
    
    if (iconName) {
      return <FontAwesome5 name={iconName} size={16} color={iconColor} />;
    }
    return <Entypo name="location" size={16} color={iconColor} />;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#07161b' }}>
        <ActivityIndicator size="large" color="#a5f3fc" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.screenHeaderContainer}>
        <Text style={styles.leftAlignedScreenTitle}>MY GRIEVANCES</Text>
      </View>

      <View style={styles.summaryBannerCard}>
        <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']} style={styles.summaryBannerGradient}>
          <View style={styles.summaryIconBox}>
            <FontAwesome5 name="clipboard-list" size={18} color="#a5f3fc" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.bannerMainTitle}>Complaint Tracking</Text>
            <Text style={styles.bannerSubTitle}>Showing your personally reported issues</Text>
          </View>
        </LinearGradient>
      </View>

      {complaints.length === 0 ? (
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40, paddingHorizontal: 20 }}>
          You haven't submitted any municipal complaints yet.
        </Text>
      ) : (
        complaints.map((ticket) => {
          // Normalizes status strings from the backend database checks (PENDING/Pending or SOLVED/Solved)
          const normalizedStatus = (ticket.status || "Pending").toUpperCase();
          const dynamicColor = normalizedStatus === "SOLVED" ? "#4ade80" : normalizedStatus === "PENDING" ? "#ef4444" : "#fbbf24";
          const progressPercent = normalizedStatus === "SOLVED" ? "100%" : normalizedStatus === "IN PROGRESS" ? "50%" : "15%";
          
          // Extracts the target field from your Java Entity layer cleanly
          const deptId = ticket.departmentId !== undefined ? ticket.departmentId : ticket.department_id;

          return (
            <View key={ticket.id.toString()} style={styles.ticketCardBase}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <Text style={styles.ticketRefNumber}>
                  Reference: {ticket.ticketNumber || ticket.ticket_number || `CR-${ticket.id}`}
                </Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  {renderDepartmentIcon(deptId, dynamicColor)}
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', marginLeft: 6 }}>
                    {DB_DEPARTMENT_MAP[deptId]?.name || "General"}
                  </Text>
                </View>
              </View>

              <Text style={[styles.ticketStatusText, { color: dynamicColor, marginTop: 4 }]}>
                Status: {ticket.status || "Pending"}
              </Text>
              
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: progressPercent, backgroundColor: dynamicColor }]} />
              </View>
              
              <Text style={styles.ticketDetailsAddress}>{ticket.title}</Text>
              <Text style={styles.ticketDateStamp}>Description: {ticket.description}</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}