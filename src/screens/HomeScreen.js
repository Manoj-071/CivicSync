import React from 'react';
import { ScrollView, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

export default function HomeScreen({ navigate }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.searchHeaderRow}>
        <View style={styles.searchBarField}>
          <Ionicons name="search" size={18} color="#94a3b8" style={{ marginRight: 8 }} />
          <TextInput placeholder="Quick Search" placeholderTextColor="#94a3b8" style={styles.textInputStyle} />
        </View>
        <TouchableOpacity style={styles.headerProfileCircle}>
          <Ionicons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.heroTextGroup}>
        <Text style={styles.mainTitleText}>Hello, Citizen!</Text>
        <Text style={styles.subTitleText}>File or Track Your Concerns.</Text>
      </View>

      <View style={styles.glassCardBase}>
        <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={styles.glassCardGradient}>
          <View style={styles.locationMarkerFrame}>
            <Ionicons name="location" size={26} color="#90b4bd" />
          </View>
          <Text style={styles.locationTitleText}>Nearby Issues (Sector 4):</Text>
          <Text style={styles.locationSubText}>Upvote local complaints.</Text>
        </LinearGradient>
      </View>

      <TouchableOpacity style={styles.primaryActionBtn} onPress={() => navigate('grievances')}>
        <Ionicons name="add" size={18} color="#ffffff" style={{ marginRight: 8 }} />
        <Text style={styles.primaryActionBtnText}>File New Unique Grievance</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}