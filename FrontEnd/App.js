import React, { useState } from 'react';
import { View, Text, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// 🔐 Authentication Context Imports
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// 📱 Dashboard & Screen Layout Imports
import HomeScreen from './src/screens/HomeScreen';
import GrievancesScreen from './src/screens/GrievancesScreen';
import DepartmentsScreen from './src/screens/DepartmentsScreen';
import AccountScreen from './src/screens/AccountScreen';

// 🗺️ New Interactive Screen Imports
import MapExplorerScreen from './src/screens/MapExplorerScreen';  // 👈 Added
import FileGrievanceScreen from './src/screens/FileGrievanceScreen'; // 👈 Added

import { styles } from './src/styles/globalStyles';

function UserDashboard() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const { logoutUser, user } = useAuth();

  // 🛰️ A shared state to pass captured hardware locations between screens smoothly
  const [sharedLocation, setSharedLocation] = useState(null);

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        // Passing both navigator hook and location storage state setter down
        return <HomeScreen navigate={setCurrentScreen} setSharedLocation={setSharedLocation} />;
      case 'departments':
        return <DepartmentsScreen navigate={setCurrentScreen} />;
      case 'grievances':
        return <GrievancesScreen />;
      case 'account':
        return <AccountScreen onLogout={logoutUser} userEmail={user?.email} />;
      
      // 🗺️ Added full layout view sub-routes
      case 'mapExplorer':
        return <MapExplorerScreen navigate={setCurrentScreen} userLocation={sharedLocation} />;
      case 'fileGrievance':
        return <FileGrievanceScreen navigate={setCurrentScreen} userLocation={sharedLocation} />;
        
      default:
        return <HomeScreen navigate={setCurrentScreen} setSharedLocation={setSharedLocation} />;
    }
  };

  // Determine if we should hide the bottom navigation tab bar (e.g., when viewing fullscreen maps)
  const isFullscreenView = currentScreen === 'mapExplorer' || currentScreen === 'fileGrievance';

  return (
    <LinearGradient colors={['#103e4b', '#07161b']} style={styles.appViewContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.appSafeAreaFrame, { paddingTop: 45 }]}>
        
        {renderScreenContent()}

        {/* Navigation Bar - Automatically slides away on fullscreen map layers */}
        {!isFullscreenView && (
          <View style={styles.navigationTabBarBase}>
            <TouchableOpacity style={styles.tabBarButton} onPress={() => setCurrentScreen('home')}>
              <Ionicons name="home" size={20} color={currentScreen === 'home' ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: currentScreen === 'home' ? '#a5f3fc' : '#94a3b8' }]}>Home</Text>
              {currentScreen === 'home' && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabBarButton} onPress={() => setCurrentScreen('grievances')}>
              <Ionicons name="folder-open" size={20} color={currentScreen === 'grievances' ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: currentScreen === 'grievances' ? '#a5f3fc' : '#94a3b8' }]}>Grievances</Text>
              {currentScreen === 'grievances' && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabBarButton} onPress={() => setCurrentScreen('departments')}>
              <Ionicons name="grid" size={20} color={currentScreen === 'departments' ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: currentScreen === 'departments' ? '#a5f3fc' : '#94a3b8' }]}>Departments</Text>
              {currentScreen === 'departments' && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabBarButton} onPress={() => setCurrentScreen('account')}>
              <Ionicons name="person" size={20} color={currentScreen === 'account' ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: currentScreen === 'account' ? '#a5f3fc' : '#94a3b8' }]}>Account</Text>
              {currentScreen === 'account' && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>
          </View>
        )}

      </SafeAreaView>
    </LinearGradient>
  );
}

// ==========================================
// ⚠️ ADMIN/OFFICER PORTAL (Admin Dashboard Placeholder)
// ==========================================
function OfficerDashboard() {
  const { logoutUser, user } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
      <Text style={{ color: '#fff', fontSize: 20, marginBottom: 10 }}>⚠️ Admin Officer Portal</Text>
      <Text style={{ color: '#e53e3e', marginBottom: 20 }}>{user?.email} (Authorized)</Text>
      <TouchableOpacity onPress={logoutUser} style={{ backgroundColor: '#319795', padding: 12, borderRadius: 8 }}>
        <Text style={{ color: '#fff' }}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// ==========================================
// 🛣️ NAVIGATION ROOT (The Gatekeeper)
// ==========================================
function NavigationRoot() {
  const { user, userRole, loading, isRegistering } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#319795" />
      </View>
    );
  }

  if (!user) {
    return isRegistering ? <RegisterScreen /> : <LoginScreen />;
  }

  return userRole === 'officer' ? <OfficerDashboard /> : <UserDashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationRoot />
    </AuthProvider>
  );
}