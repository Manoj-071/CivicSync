import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

// 🛠️ Updated parameters to handle both simple string navigation and custom parameters
export default function DepartmentsScreen({ navigate, navigation }) {
  
  const handleDeptPress = (deptName) => {
    if (navigation && navigation.navigate) {
      // Fires the deep page path if the custom router is present
      navigation.navigate('department-feed', { category: deptName });
    } else if (navigate) {
      // Fallback check
      navigate('grievances');
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.screenHeaderWithBack}>
        <Text style={styles.centeredScreenTitle}>DEPARTMENTS</Text>
        <TouchableOpacity style={styles.headerProfileCircle}>
          <Ionicons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        {/* Row 1: Sanitation & Roads */}
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Sanitation')}>
            <FontAwesome5 name="trash-alt" size={28} color="#4ade80" />
            <Text style={styles.tileLabelText}>Sanitation</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Roads & Bridges')}>
            <FontAwesome5 name="road" size={26} color="#fbbf24" />
            <Text style={styles.tileLabelText}>Roads & Bridges</Text>
          </TouchableOpacity>
        </View>

        {/* Row 2: Water Supply & Public Lighting */}
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Water Supply')}>
            <FontAwesome5 name="faucet" size={26} color="#38bdf8" />
            <Text style={styles.tileLabelText}>Water Supply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Public Lighting')}>
            <FontAwesome5 name="lightbulb" size={26} color="#fef08a" />
            <Text style={styles.tileLabelText}>Public Lighting</Text>
          </TouchableOpacity>
        </View>

        {/* Row 3: Public Health & Education */}
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Public Health')}>
            <FontAwesome5 name="heartbeat" size={26} color="#f43f5e" />
            <Text style={styles.tileLabelText}>Public Health</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Education')}>
            <FontAwesome5 name="graduation-cap" size={26} color="#cbd5e1" />
            <Text style={styles.tileLabelText}>Education</Text>
          </TouchableOpacity>
        </View>

        {/* Row 4: Transport & Sewage/Drains */}
        <View style={styles.gridRow}>
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Transport')}>
            <FontAwesome5 name="bus" size={26} color="#fb923c" />
            <Text style={styles.tileLabelText}>Transport</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.gridTile} onPress={() => handleDeptPress('Sewage & Drains')}>
            <FontAwesome5 name="water" size={26} color="#22d3ee" />
            <Text style={[styles.tileLabelText, { textAlign: 'center' }]}>Sewage & Drains</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}