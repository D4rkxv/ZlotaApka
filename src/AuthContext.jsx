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

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
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
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );
  const [currentPage, setCurrentPage] = useState("landing");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem("token");

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
            setToken(null);
            setCurrentPage("landing");
          }
        } catch (err) {
          console.error("Auth error:", err);
          localStorage.removeItem("token");
          setToken(null);
          setCurrentPage("landing");
        } finally {
          setIsLoading(false);
        }
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", { email, password });

      if (response.data.status === "success") {
        setUser(response.data.data.user);
        setToken(response.data.data.token);
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
    setCurrentPage("landing");
    localStorage.removeItem("token");
  };
  const setName = (newName) => {
    setUser({ ...user, name: newName });
  };
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
