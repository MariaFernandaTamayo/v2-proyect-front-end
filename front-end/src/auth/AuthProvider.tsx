import { useContext, createContext, useState, useEffect } from "react";
import type { AuthResponse, AccessTokenResponse, User } from "../types/types";
import { API_URL } from "./constants";

interface AuthProviderProps {
  children: React.ReactNode;
}
const AuthContext = createContext({
  isAuthenticated: false,
  getAccessToken: () => {},
  saveUser: (_userData: AuthResponse) => {},
  getRefreshToken: () => {},
  getUser: () => ({} as User | undefined),
  logout: () => {}, // Agregar función logout
});
export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string>("");
  const [refreshToken, setRefreshToken] = useState<string>("");
  const [user, setUser] = useState<User>();

  useEffect(() => {
    checkAuth();
  }, []);

  async function requestNewAccessToken(refreshToken: string) {
    try {
      const response = await fetch(`${API_URL}/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
        },
      });
      if (response.ok) {
        const json = (await response.json()) as AccessTokenResponse;

        if (json.error) {
          throw new Error(json.error);
        }
        return json.body.accessToken;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function getUserInfo(accessToken: string) {
    try {
      const response = await fetch(`${API_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const json = await response.json();

        if (json.error) {
          throw new Error(json.error);
        }
        return json.body;
      } else {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async function checkAuth() {
    const token = getRefreshToken();
    if (token) {
      const newAccessToken = await requestNewAccessToken(token);
      if (newAccessToken) {
        const userInfo = await getUserInfo(newAccessToken);
        if (userInfo) {
          saveSessionInfo(userInfo, newAccessToken, token);
        }
      }
    }
  }

  function saveSessionInfo(
    userInfo: User,
    accessToken: string,
    refreshToken: string
  ) {
    setAccessToken(accessToken);
    localStorage.setItem("token", JSON.stringify(refreshToken));
    setIsAuthenticated(true);
    setUser(userInfo);
  }

  function getAccessToken() {
    return accessToken;
  }
  function getRefreshToken() {
    if (!!refreshToken) {
      return refreshToken;
    }
    const token = localStorage.getItem("token");
    if (token) {
      const refreshToken  = JSON.parse(token);
      setRefreshToken(refreshToken);
      return refreshToken;
    }
    return null;
  }

  function saveUser(userData: AuthResponse) {
    saveSessionInfo(
      userData.body.user,
      userData.body.accessToken,
      userData.body.refreshToken
    );
  }
  function getUser() {
    return user;
  }

  function logout() {
    // Limpiar datos de autenticación y redirigir a la página de inicio de sesión
    localStorage.removeItem("token");
    setAccessToken("");
    setIsAuthenticated(false);
    setUser(undefined);
    // Redireccionar a la página de inicio de sesión (cambia "/login" al enlace real)
    window.location.href = "/";
  }
  

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        getAccessToken,
        saveUser,
        getRefreshToken,
        getUser,
        logout, // Agregar logout al contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth =() => useContext(AuthContext);