import React, { useState } from 'react';
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
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
import { styles } from './src/styles/globalStyles';

// ==========================================
// 👤 MAIN CITIZEN DASHBOARD (Your Beautiful UI Layout)
// ==========================================
function UserDashboard() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const { logoutUser, user } = useAuth(); // Hooking into your friend's auth state if needed

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'home':
        return <HomeScreen navigate={setCurrentScreen} />;
      case 'departments':
        return <DepartmentsScreen navigate={setCurrentScreen} />;
      case 'grievances':
        return <GrievancesScreen />;
      case 'account':
        // Passing logoutUser into AccountScreen so the sign-out button works!
        return <AccountScreen onLogout={logoutUser} userEmail={user?.email} />;
      default:
        return <HomeScreen navigate={setCurrentScreen} />;
    }
  };

  return (
    <LinearGradient colors={['#103e4b', '#07161b']} style={styles.appViewContainer}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={[styles.appSafeAreaFrame, { paddingTop: 45 }]}>
        
        {renderScreenContent()}

        {/* Navigation Bar */}
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

  // If system is verifying auth tokens, display a loading spinner
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#319795" />
      </View>
    );
  }

  // If no user session is found, show Login or Registration forms
  if (!user) {
    return isRegistering ? <RegisterScreen /> : <LoginScreen />;
  }

  // If logged in, segregate access depending on user system permissions
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