import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles as globalStyles, colors } from '../styles/globalStyles'; // 👈 Imported as globalStyles to fix collision
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { loginUser, setIsRegistering } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please fill in all fields.");
    setAuthLoading(true);
    try {
      await loginUser(email, password);
    } catch (error) {
      Alert.alert("Authentication Failed", error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <LinearGradient colors={colors.bgGradient} style={globalStyles.container}>
      <View style={globalStyles.glassCard}>
        <Text style={localStyles.title}>CivicSync</Text>
        <Text style={localStyles.subtitle}>Sign in to report or resolve local concerns</Text>

        <TextInput 
          style={globalStyles.input} 
          placeholder="Official or Personal Email" 
          placeholderTextColor={colors.textSecondary}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput 
          style={globalStyles.input} 
          placeholder="Password" 
          placeholderTextColor={colors.textSecondary}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={globalStyles.primaryButton} onPress={handleLogin} disabled={authLoading}>
          {authLoading ? <ActivityIndicator color="#fff" /> : <Text style={globalStyles.buttonText}>Sign In</Text>}
        </TouchableOpacity>

        <TouchableOpacity style={[globalStyles.primaryButton, localStyles.googleBtn]}>
          <Text style={globalStyles.buttonText}>🌐 Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => setIsRegistering(true)}>
        <Text style={localStyles.footerText}>Don't have a regular account? <Text style={{color: colors.accent}}>Create Account</Text></Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

// 👈 Renamed to localStyles to prevent colliding with your theme global styles object
const localStyles = StyleSheet.create({
  title: { fontSize: 36, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 4 },
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginBottom: 28, fontSize: 14 },
  googleBtn: { backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: colors.glassBorder, marginTop: 12 },
  footerText: { color: colors.textSecondary, textAlign: 'center', marginTop: 12 }
});