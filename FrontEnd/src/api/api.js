// 🖥️ Your active working computer IP configuration
const BASE_URL = "http://10.227.0.200:8080/api/grievances";
const AUTH_URL = "http://10.227.0.200:8080/api/auth";

/**
 * 📬 FETCH ALL COMPLAINTS FROM THE JAVA BACKEND
 */
async function fetchGrievances() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching live grievances:", error);
    return [];
  }
}

/**
 * 📩 SUBMIT A NEW COMPLAINT TO THE JAVA BACKEND
 */
async function createGrievance(grievanceData) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // 🎯 Maps Minimal DTO schema matching GrievanceRequestDTO on your backend
      body: JSON.stringify({
        title: grievanceData.title,
        description: grievanceData.description,
        category: grievanceData.category || grievanceData.department, // Maps to backend 'category'
        latitude: grievanceData.latitude || 11.93,
        longitude: grievanceData.longitude || 79.49,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error creating live grievance:", error);
    throw error;
  }
}

/**
 * 🔑 REGISTER USER VIA EMAIL & PASSWORD (Unified to use Fetch)
 */
async function registerCitizen(userPayload) {
  try {
    const response = await fetch(`${AUTH_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });
    
    return await response.json();
  } catch (error) {
    console.error("API Registration Error:", error);
    return { error: "Cannot connect to backend verification server" };
  }
}

/**
 * 🔐 LOGIN USER VIA EMAIL & PASSWORD
 */
async function loginCitizen(email, password) {
  try {
    const response = await fetch(`${AUTH_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error("Login failed:", error);
    return { error: "Network error. Check server status." };
  }
}

/**
 * 🌐 GOOGLE SIGN-IN INTEGRATION
 */
async function loginWithGoogleBackend(name, email, googleId) {
  try {
    const response = await fetch(`${AUTH_URL}/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, googleId }),
    });
    return await response.json();
  } catch (error) {
    console.error("Google authentication failed:", error);
    return { error: "Failed to authenticate Google user." };
  }
}

// 📦 Unified Clean Exports Block (No duplicates!)
export {
  fetchGrievances,
  createGrievance,
  registerCitizen,
  loginCitizen,
  loginWithGoogleBackend,
};