
import { createContext, useState, useCallback, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const authenticate = useCallback(async (email, password) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post("/api/users/login", { email, password });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));

      setUser(response.data);

      if (response.data.logintype === "Admin") {
        navigate("/admin");
      } else if (response.data.logintype === "User") {
        navigate("/chat");
      }

      if (response.data.id) {
        await axios.patch(`/api/acc/${response.data.id}`, { accountstatus: "active" });
      }
    } catch (error) {
      console.error(error);
      setError(error?.response?.data?.message ?? "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (user) {
        await axios.patch(`/api/acc/${user.id}`, { accountstatus: "inactive" });
      }

      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error('Error logging out:', error);
      setError("Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  const value = useMemo(() => ({ user, logout, authenticate, isLoading, error }), [
    user,
    logout,
    authenticate,
    isLoading,
    error,
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
