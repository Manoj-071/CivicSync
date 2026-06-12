import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, MaterialIcons, Entypo } from '@expo/vector-icons';
import { styles, colors } from '../styles/globalStyles';

export default function GrievancesScreen() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserGrievances = async () => {
      try {
        // 🔮 FUTURE BACKEND INTEGRATION:
        // When your Java backend is ready, you will fetch only the complaints filed by the logged-in user:
        // const response = await fetch("http://YOUR_LAPTOP_IP:8080/api/grievances/my-complaints");
        // const data = await response.json();
        // setComplaints(data);

        // 🛠️ PERSONALIZED DATA ARRAY: Simulating a user's unique filed complaint history
        const userFiledComplaints = [
          {
            id: "CR-A12B3",
            category: "Sanitation",
            title: "Garbage overflow near residential gate",
            status: "Under Review",
            progress: "45%",
            statusColor: "#38bdf8",
            date: "June 08, 2026",
            icon: "trash-alt",
            iconType: "FontAwesome5"
          },
          {
            id: "CR-E88W2",
            category: "Electricity",
            title: "Streetlight flickering continuously at night",
            status: "Acknowledged",
            progress: "20%",
            statusColor: "#fbbf24",
            date: "June 05, 2026",
            icon: "lightbulb",
            iconType: "MaterialIcons"
          },
          {
            id: "CR-S19R1",
            category: "Water Supply",
            title: "Low water pressure & muddy water supply",
            status: "Solved",
            progress: "100%",
            statusColor: "#4ade80",
            date: "May 28, 2026",
            icon: "water",
            iconType: "Entypo"
          }
        ];

        setComplaints(userFiledComplaints);
      } catch (error) {
        console.error("Error reading personal municipal records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserGrievances();
  }, []);

  // Helper function to render the correct department icon dynamically
  const renderDepartmentIcon = (ticket) => {
    if (ticket.iconType === "MaterialIcons") {
      return <MaterialIcons name={ticket.icon} size={20} color={ticket.statusColor} />;
    }
    if (ticket.iconType === "Entypo") {
      return <Entypo name={ticket.icon} size={20} color={ticket.statusColor} />;
    }
    return <FontAwesome5 name={ticket.icon} size={18} color={ticket.statusColor} />;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#a5f3fc" />
      </View>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* 🛠️ Fixed Screen Header Text */}
      <View style={styles.screenHeaderContainer}>
        <Text style={styles.leftAlignedScreenTitle}>MY GRIEVANCES</Text>
      </View>

      {/* 📋 Dynamic Summary Overview Card */}
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

      {/* 🔄 Dynamic List Engine */}
      {complaints.length === 0 ? (
        <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
          You haven't submitted any municipal complaints yet.
        </Text>
      ) : (
        complaints.map((ticket) => (
          <View key={ticket.id} style={styles.ticketCardBase}>
            {/* Ticket Header Row */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <Text style={styles.ticketRefNumber}>Reference: {ticket.id}</Text>
              
              {/* Little contextual icon pill showing what department this ticket belongs to */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.04)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                {renderDepartmentIcon(ticket)}
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600', marginLeft: 6 }}>{ticket.category}</Text>
              </View>
            </View>

            <Text style={[styles.ticketStatusText, { color: ticket.statusColor, marginTop: 4 }]}>
              Status: {ticket.status}
            </Text>
            
            {/* Graphical Progress Bar Filler */}
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: ticket.progress, backgroundColor: ticket.statusColor }
                ]} 
              />
            </View>
            
            <Text style={styles.ticketDetailsAddress}>{ticket.title}</Text>
            <Text style={styles.ticketDateStamp}>Filed On: {ticket.date}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}