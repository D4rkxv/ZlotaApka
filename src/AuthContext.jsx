import React, {
  useState,
  useContext,
  createContext,
  useEffect,
  use,
} from "react";
import axios from "axios";
export const AuthContext = createContext();

const api = axios.create({
  baseURL: `http://localhost:3001/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

const getStoredToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || null;

api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers["Authorization"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => getStoredToken());
  const [currentPage, setCurrentPage] = useState("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    if (token) {
      
    } else {
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = getStoredToken();

      if (savedToken) {
        setIsLoading(true);
        try {
          const response = await api.get("/auth/me");

          if (response.data.status === "success") {
            setUser(response.data.data);
            setToken(savedToken);
            setCurrentPage("dashboard");
          } else {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            setToken(null);
            setCurrentPage("landing");
          }
        } catch (err) {
          console.error("Auth error:", err);
          localStorage.removeItem("token");
          sessionStorage.removeItem("token");
          setToken(null);
          setCurrentPage("landing");
        } finally {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    if (user && token && !userProfile) {
      console.log("Fetching user profile data...");
      fetchUserProfile();
    }
  }, [user, token]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/profile");

      if (response.data.status === "success") {
        console.log("Fetched user profile:", response.data.data);
        setUserProfile(response.data.data);
        return response.data.data;
      } else {
        console.error("Failed to fetch profile:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      console.log("Updating profile with:", profileData);

      const response = await api.put("/profile", profileData);

      if (response.data.status === "success") {
        console.log("Profile updated:", response.data.data);
        setUserProfile(response.data.data);
        return { success: true, data: response.data.data };
      } else {
        console.error("Failed to update profile:", response.data);
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password, rememberMe });

      if (response.data.status === "success") {
        const { token, rememberMe: rm } = response.data.data;
        if (rm) {
          localStorage.setItem("token", token);
          sessionStorage.removeItem("token");
        } else {
          sessionStorage.setItem("token", token);
          localStorage.removeItem("token");
        }
        setUser(response.data.data.user);
        setToken(token);
        setCurrentPage("dashboard");
        return { success: true };
      } else {
        setError(response.data.message || "Login failed");
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Network error - check if backend is running";
      setError(errorMsg);
      console.error("Login error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
      });

      if (response.data.status === "success") {
        setUser(response.data.data.user);
        setToken(response.data.data.token);
        setCurrentPage("dashboard");
        return { success: true };
      } else {
        setError(response.data.message || "Registration failed");
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.message ||
        "Network error - check if backend is running";
      setError(errorMsg);
      console.error("Registration error:", err);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setUserProfile(null);
    setCurrentPage("landing");
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
  };
  const setName = async (newName, imageFile = null) => {
  try {
    const formData = new FormData();
    formData.append("name", newName);
    if (imageFile) formData.append("image", imageFile);

    await api.put("/profile/name", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setUser({ ...user, name: newName });
  } catch (error) {
    console.error("Error updating name:", error);
  }
}
  const switchPage = (page) => {
    setCurrentPage(page);
  };
  const goToLanding = () => setCurrentPage("landing");
  const goToLogin = () => setCurrentPage("login");
  const goToRegister = () => setCurrentPage("register");

  return (
    <AuthContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        switchPage: switchPage,
        goToLanding,
        goToLogin,
        goToRegister,
        logout,
        login,
        user,
        isAuthenticated,
        setName,
        register,
        token,
        isLoading,
        error,
        userProfile,
        fetchUserProfile,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthLayout = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthLayout musi być użyty wewnatrz AuthLayoutProvider");
  }
  return context;
};

export { api };
