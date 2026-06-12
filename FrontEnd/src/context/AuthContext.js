import React, { createContext, useState, useContext } from "react";
import { Alert } from "react-native";
// 🔌 Import your live network endpoints from your new api.js file
import {
  loginCitizen,
  registerCitizen as apiRegisterCitizen,
} from "../api/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Stores logged-in session profile data
  const [isRegistering, setIsRegistering] = useState(false); // Controls toggle between screens

  // 🔐 HANDLE LIVE USER LOGIN
  const loginUser = async (email, password) => {
    const result = await loginCitizen(email, password);

    if (result.error) {
      // If Java backend throws an error message mapping back
      throw new Error(result.error);
    } else {
      // If successful, pass the database profile object to your frontend state
      setUser({
        id: result.userId,
        name: result.name,
        email: result.email,
      });
      Alert.alert("Welcome Back!", `Logged in successfully as ${result.name}`);
    }
  };

  // 🔑 HANDLE LIVE USER REGISTRATION
  // 🔑 HANDLE LIVE USER REGISTRATION
  const registerUser = async (userPayload) => {
    try {
      // Pass the unified structural payload directly down to your api.js function
      const result = await apiRegisterCitizen(userPayload);

      // Handle backend JSON error responses if they return
      if (result.error) {
        throw new Error(result.error);
      }

      // Check for success markers from our refactored AuthController
      if (result.message === "User registered successfully!" || result.userId) {
        Alert.alert("Success", "Account created successfully! Please sign in.");
        setIsRegistering(false); // Snap back to login panel view layout automatically
      } else {
        throw new Error(
          "Registration failed due to an unknown database response.",
        );
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };

  // 🚪 LOGOUT ACTION
  const logoutUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isRegistering,
        setIsRegistering,
        loginUser,
        registerCitizen: registerUser, // Maps the property call your register component expects
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
