import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

export default function DepartmentsScreen({ navigate }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.screenHeaderWithBack}>
        <Text style={styles.centeredScreenTitle}>DEPARTMENTS</Text>
        <TouchableOpacity style={styles.headerProfileCircle}>
          <Ionicons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile} onPress={() => navigate('grievances')}>
            <FontAwesome5 name="trash-alt" size={28} color="#4ade80" />
            <Text style={styles.tileLabelText}>Sanitation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="road" size={26} color="#fbbf24" />
            <Text style={styles.tileLabelText}>Roads & Bridges</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="faucet" size={26} color="#38bdf8" />
            <Text style={styles.tileLabelText}>Water Supply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="lightbulb" size={26} color="#fef08a" />
            <Text style={styles.tileLabelText}>Public Lighting</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="heartbeat" size={26} color="#f43f5e" />
            <Text style={styles.tileLabelText}>Public Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="graduation-cap" size={26} color="#cbd5e1" />
            <Text style={styles.tileLabelText}>Education</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="bus" size={26} color="#fb923c" />
            <Text style={styles.tileLabelText}>Transport</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile}>
            <FontAwesome5 name="hands-helping" size={26} color="#f472b6" />
            <Text style={styles.tileLabelText}>Social Welfare</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}