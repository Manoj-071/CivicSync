import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

export default function GrievancesScreen() {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.screenHeaderContainer}>
        <Text style={styles.leftAlignedScreenTitle}>SANITATION COMPLAINTS</Text>
      </View>

      <View style={styles.summaryBannerCard}>
        <LinearGradient colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']} style={styles.summaryBannerGradient}>
          <View style={styles.summaryIconBox}>
            <FontAwesome5 name="trash-alt" size={20} color="#4ade80" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.bannerMainTitle}>Sanitation</Text>
            <Text style={styles.bannerSubTitle}>Recent complaints near you</Text>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.ticketCardBase}>
        <Text style={styles.ticketRefNumber}>Reference: CR-A12B3</Text>
        <Text style={styles.ticketStatusText}>(Status: Under Review)</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '45%', backgroundColor: '#38bdf8' }]} />
        </View>
        <Text style={styles.ticketDetailsAddress}>Pothole, Main Street</Text>
        <Text style={styles.ticketDateStamp}>Date: May 17, 2022</Text>
      </View>

      <View style={styles.ticketCardBase}>
        <Text style={styles.ticketRefNumber}>Reference: CR-S45T7</Text>
        <Text style={styles.ticketStatusText}>(Status: Acknowledged)</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '20%', backgroundColor: '#fbbf24' }]} />
        </View>
        <Text style={styles.ticketDetailsAddress}>Waste overflow, Market Area</Text>
        <Text style={styles.ticketDateStamp}>Date: May 17, 2022</Text>
      </View>

      <View style={styles.ticketCardBase}>
        <Text style={styles.ticketRefNumber}>Reference: CR-S19R1</Text>
        <Text style={styles.ticketStatusText}>(Status: Solved)</Text>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '100%', backgroundColor: '#4ade80' }]} />
        </View>
        <Text style={styles.ticketDetailsAddress}>Broken Drain, Sector 4, Jan 20</Text>
        <Text style={styles.ticketDateStamp}>Date: May 17, 2022</Text>
      </View>
    </ScrollView>
  );
}