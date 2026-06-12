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
import MapExplorerScreen from './src/screens/MapExplorerScreen';  
import FileGrievanceScreen from './src/screens/FileGrievanceScreen'; 
import DepartmentFeedScreen from './src/screens/DepartmentFeedScreen'; // 👈 Included from feed update!

import { styles } from './src/styles/globalStyles';

// ==========================================
// 👤 MAIN CITIZEN DASHBOARD (Your Beautiful UI Layout)
// ==========================================
function UserDashboard() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState(''); // 👈 Tracks department card selection
  const [sharedLocation, setSharedLocation] = useState(null);    // 👈 Tracks GPS hardware state
  const { logoutUser, user } = useAuth();

  // 🔌 Robust Navigation Layer: Accepts multiple paths and payload parameters safely
  const customNavigate = (screenName, params) => {
    if (params?.category) {
      setSelectedCategory(params.category);
    }
    setCurrentScreen(screenName);
  };

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen navigate={customNavigate} setSharedLocation={setSharedLocation} />;
      case 'departments':
        return (
          <DepartmentsScreen 
            navigate={(dest, params) => customNavigate(dest, params)} 
            navigation={{ navigate: customNavigate }} 
          />
        );
      case 'department-feed':
        return (
          <DepartmentFeedScreen 
            route={{ params: { category: selectedCategory } }} 
            navigation={{ goBack: () => setCurrentScreen('departments') }} 
          />
        );
      case 'grievances':
        return <GrievancesScreen />;
      case 'account':
        return <AccountScreen onLogout={logoutUser} userEmail={user?.email} />;
      
      // 🗺️ Full layout view sub-routes
      case 'mapExplorer':
        return <MapExplorerScreen navigate={customNavigate} userLocation={sharedLocation} />;
      case 'fileGrievance':
        return <FileGrievanceScreen navigate={customNavigate} userLocation={sharedLocation} />;
        
      default:
        return <HomeScreen navigate={customNavigate} setSharedLocation={setSharedLocation} />;
    }
  };

  // Determine if we should hide the bottom navigation tab bar (slide away on maps/forms/sub-feeds)
  const isFullscreenView = ['mapExplorer', 'fileGrievance', 'department-feed'].includes(currentScreen);

  return (
    <LinearGradient colors={['#103e4b', '#07161b']} style={styles.appViewContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.appSafeAreaFrame, { paddingTop: 45, flex: 1 }]}>
        
        {/* Render Active View State Container */}
        <View style={{ flex: 1 }}>
          {renderScreenContent()}
        </View>

        {/* Navigation Bar - Automatically hides on fullscreen view stacks */}
        {!isFullscreenView && (
          <View style={styles.navigationTabBarBase}>
            <TouchableOpacity style={styles.tabBarButton} onPress={() => customNavigate('home')}>
              <Ionicons name="home" size={20} color={currentScreen === 'home' ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: currentScreen === 'home' ? '#a5f3fc' : '#94a3b8' }]}>Home</Text>
              {currentScreen === 'home' && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabBarButton} onPress={() => customNavigate('grievances')}>
              <Ionicons name="folder-open" size={20} color={currentScreen === 'grievances' ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: currentScreen === 'grievances' ? '#a5f3fc' : '#94a3b8' }]}>Grievances</Text>
              {currentScreen === 'grievances' && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabBarButton} onPress={() => customNavigate('departments')}>
              <Ionicons name="grid" size={20} color={['departments', 'department-feed'].includes(currentScreen) ? '#a5f3fc' : '#94a3b8'} />
              <Text style={[styles.tabBarLabelText, { color: ['departments', 'department-feed'].includes(currentScreen) ? '#a5f3fc' : '#94a3b8' }]}>Departments</Text>
              {['departments', 'department-feed'].includes(currentScreen) && <View style={styles.tabActiveBarPointer} />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.tabBarButton} onPress={() => customNavigate('account')}>
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

// ==========================================
// 🏢 APP ROOT ENTRY POINT
// ==========================================
export default function App() {
  return (
    <AuthProvider>
      <NavigationRoot />
    </AuthProvider>
  );
}