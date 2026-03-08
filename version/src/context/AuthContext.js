
import { createContext, useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  console.log("user:", user);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const authenticate = useCallback(async (email,e, password) => {
    e.preventDefault();
    try {
      setIsLoading(true);

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
      console.log(error);
      alert("No User Found");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      if (user) {
        await axios.patch(`/api/acc/${user.id}`, { accountstatus: "inactive" });
      }

      setUser(null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setIsLoading(false);
    }
  }, [navigate, user]);

  return (
    <AuthContext.Provider value={{ user, logout, authenticate, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
