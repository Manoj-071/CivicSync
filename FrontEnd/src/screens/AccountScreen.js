import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { styles } from '../styles/globalStyles';

// 👈 Destructure the props passed from your merged App.js
export default function AccountScreen({ onLogout, userEmail }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      <View style={styles.screenHeaderContainer}>
        <Text style={styles.centeredScreenTitleText}>USER ACCOUNT</Text>
        <TouchableOpacity style={styles.headerProfileCircle}>
          <Ionicons name="person" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileGlassBanner}>
        <LinearGradient colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.03)']} style={styles.profileBannerGradient}>
          <View style={styles.profileAvatarFrame}>
            <Ionicons name="person" size={26} color="#64748b" />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            {/* 👈 Dynamic email replaces the hardcoded name */}
            <Text style={styles.profileNameText} numberOfLines={1}>
              {userEmail ? userEmail.split('@')[0] : 'Citizen User'}
            </Text>
            <Text style={styles.profileSubEmail} numberOfLines={1}>
              {userEmail || 'citizen@civicsync.com'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </LinearGradient>
      </View>

      <View style={styles.settingsMenuBox}>
        <TouchableOpacity style={styles.menuRowItem}>
          <View style={styles.menuRowLeft}>
            <Ionicons name="pencil" size={18} color="#94a3b8" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemLabelText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRowItem}>
          <View style={styles.menuRowLeft}>
            <Ionicons name="notifications" size={18} color="#94a3b8" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemLabelText}>Notification Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRowItem}>
          <View style={styles.menuRowLeft}>
            <Ionicons name="lock-closed" size={18} color="#94a3b8" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemLabelText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuRowItem}>
          <View style={styles.menuRowLeft}>
            <Ionicons name="chatbox-ellipses" size={18} color="#94a3b8" style={{ marginRight: 12 }} />
            <Text style={styles.menuItemLabelText}>Submit App Feedback</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#94a3b8" />
        </TouchableOpacity>

        {/* 👈 Added the onPress handler to trigger your friend's logout sequence */}
        <TouchableOpacity style={styles.menuRowItem} onPress={onLogout}>
          <View style={styles.menuRowLeft}>
            <MaterialIcons name="logout" size={18} color="#e53e3e" style={{ marginRight: 12 }} />
            <Text style={[styles.menuItemLabelText, { color: '#e53e3e' }]}>Logout</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}