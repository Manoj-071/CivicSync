import React, { createContext, useState, useContext } from 'react';
import { Alert } from 'react-native';
import { authService } from '../api/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // Will parse 'citizen' or 'officer' from Java
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const response = await authService.login(email, password);
      const data = await response.json();

      if (response.ok) {
        setUser({ email: data.email, uid: data.uid });
        setUserRole(data.role); // Handled perfectly by your Java email-filter logic!
      } else {
        Alert.alert("Authentication Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Cannot reach the Java backend server. Check your IP configuration.");
    } finally {
      setLoading(false);
    }
  };

  const registerCitizen = async (formData) => {
    setLoading(true);
    try {
      const response = await authService.register(formData);
      const data = await response.json();

      if (response.ok) {
        // Auto-login or redirect back to sign-in on success
        Alert.alert("Success", "Account created successfully!");
        setIsRegistering(false);
      } else {
        Alert.alert("Registration Failed", data.message || "Could not register user.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Server unreachable during user registration.");
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setUserRole(null);
    setIsRegistering(false);
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, isRegistering, setIsRegistering, loginUser, registerCitizen, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);