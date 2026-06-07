import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Dashboard placeholders to verify setup
function UserDashboard() {
  const { logoutUser, user } = useAuth();
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f172a'}}>
      <Text style={{color:'#fff', fontSize:20, marginBottom:10}}>Citizen Dashboard View</Text>
      <Text style={{color:'#a0aec0', marginBottom:20}}>{user?.email}</Text>
      <TouchableOpacity onPress={logoutUser} style={{backgroundColor:'#319795', padding:12, borderRadius:8}}><Text style={{color:'#fff'}}>Sign Out</Text></TouchableOpacity>
    </View>
  );
}

function OfficerDashboard() {
  const { logoutUser, user } = useAuth();
  return (
    <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f172a'}}>
      <Text style={{color:'#fff', fontSize:20, marginBottom:10}}>⚠️ Admin Officer Portal</Text>
      <Text style={{color:'#e53e3e', marginBottom:20}}>{user?.email} (Authorized)</Text>
      <TouchableOpacity onPress={logoutUser} style={{backgroundColor:'#319795', padding:12, borderRadius:8}}><Text style={{color:'#fff'}}>Sign Out</Text></TouchableOpacity>
    </View>
  );
}

function NavigationRoot() {
  const { user, userRole, loading, isRegistering } = useAuth();

  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'#0f172a'}}>
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