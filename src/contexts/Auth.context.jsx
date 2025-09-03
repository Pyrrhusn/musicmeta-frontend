import {
  createContext,
  useState,
  useCallback,
  useMemo,
  useContext,
  useEffect,
} from "react";
import useSWRMutation from "swr/mutation";
import * as api from "../api";

const JWT_TOKEN_KEY = "jwtToken";
const USER_ID_KEY = "userId";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [ready, setReady] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [token, setToken] = useState(localStorage.getItem(JWT_TOKEN_KEY));
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.setAuthToken(token);
    setIsAuthed(Boolean(token));
    setReady(true);
  }, [token]);

  const {
    isMutating: loginLoading,
    error: loginError,
    trigger: doLogin,
  } = useSWRMutation("users/login", api.post);

  const {
    isMutating: registerLoading,
    error: registerError,
    trigger: doRegister,
  } = useSWRMutation("users/register", api.post);

  const setSession = useCallback((token, user) => {
    setToken(token);
    setUser(user);

    localStorage.setItem(JWT_TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, user.userId);
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        const { token, user } = await doLogin({
          email,
          password,
        });

        setSession(token, user);

        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doLogin]
  );

  const register = useCallback(
    async (data) => {
      try {
        const { token, user } = await doRegister(data);
        setSession(token, user);
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [doRegister, setSession]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(JWT_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  }, []);

  // manual page refreshes cause isArtist and isAdmin to be false because user in state becomes null
  // fixes: use localstorage --but its senstive data & used for conditional rendering
  //            & not best practice??
  //        use backend to get user data again --no time to find out
  // on the other hand, users can only access private routes in one session
  const isArtist = useMemo(() => {
    if (isAuthed && Boolean(user?.isArtist)) {
      return true;
    }
    return false;
  }, [isAuthed, user]);

  const isAdmin = useMemo(() => {
    if (isAuthed && user?.roles?.includes("admin")) {
      return true;
    }
    return false;
  }, [isAuthed, user]);

  const value = useMemo(
    () => ({
      token,
      user,
      error: loginError || registerError,
      ready,
      loading: loginLoading || registerLoading,
      isAuthed,
      isArtist,
      isAdmin,
      login,
      logout,
      register,
    }),
    [
      token,
      user,
      loginError,
      registerError,
      ready,
      loginLoading,
      registerLoading,
      isAuthed,
      isArtist,
      isAdmin,
      login,
      logout,
      register,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
