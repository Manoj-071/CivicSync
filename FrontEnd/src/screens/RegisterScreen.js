import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles as globalStyles, colors } from "../styles/globalStyles"; // 👈 Renamed here too!
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const { registerCitizen, setIsRegistering } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    sector: "",
  });

  const handleRegister = async () => {
    // 🚨 Updated validation check to make sure Phone is explicitly mandatory before calling the API
    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.phone ||
      !form.sector
    ) {
      return Alert.alert(
        "Required Fields Missing",
        "Please complete all profile specifics, including your phone number, before continuing.",
      );
    }

    setSubmitting(true);
    try {
      // 🎯 FIX: Explicitly name the fields to match the Java Spring Boot Entity variables perfectly
      const cleanUserPayload = {
        name: form.name,
        email: form.email,
        phoneNumber: form.phone, // 📱 Changed from 'phone' to 'phoneNumber'
        passwordHash: form.password, // 🔑 Changed from 'password' to 'passwordHash'
      };

      // Pass the fully synchronized payload object directly into your Auth context mechanism
      await registerCitizen(cleanUserPayload);
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LinearGradient colors={colors.bgGradient} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={[globalStyles.container, { paddingTop: 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.glassCard}>
          <Text style={localStyles.title}>Register Profile</Text>
          <Text style={localStyles.subtitle}>
            Provide your municipal residency metadata
          </Text>

          <TextInput
            style={globalStyles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.textSecondary}
            onChangeText={(t) => setForm({ ...form, name: t })}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(t) => setForm({ ...form, email: t })}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Password (Min 6 Characters)"
            placeholderTextColor={colors.textSecondary}
            secureTextEntry
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Phone Number"
            placeholderTextColor={colors.textSecondary}
            keyboardType="phone-pad"
            onChangeText={(t) => setForm({ ...form, phone: t })}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Residential Address / Landmark"
            placeholderTextColor={colors.textSecondary}
            onChangeText={(t) => setForm({ ...form, address: t })}
          />
          <TextInput
            style={globalStyles.input}
            placeholder="Sector / Ward Number (e.g. Sector 4)"
            placeholderTextColor={colors.textSecondary}
            onChangeText={(t) => setForm({ ...form, sector: t })}
          />

          <TouchableOpacity
            style={globalStyles.primaryButton}
            onPress={handleRegister}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={globalStyles.buttonText}>Complete Onboarding</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => setIsRegistering(false)}>
          <Text
            style={{
              color: colors.textSecondary,
              textAlign: "center",
              marginBottom: 20,
            }}
          >
            Return to Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

// 👈 Renamed to localStyles to match
const localStyles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  subtitle: { color: colors.textSecondary, marginBottom: 22, fontSize: 13 },
});
