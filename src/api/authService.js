// 🛑 REPLACE WITH YOUR COMPUTER'S ACTUAL IPv4 ADDRESS (e.g., 192.168.1.5)
// Do not use "localhost" or "127.0.0.1" because mobile phone emulators will look inside themselves.
const BASE_URL = "http://192.168.X.X:8080/api/auth";

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return response;
  },

  register: async (profileData) => {
    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profileData),
    });
    return response;
  }
};