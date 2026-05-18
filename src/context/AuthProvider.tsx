import {
  useState,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
  useEffect,
} from "react";

type AuthContextType = {
  //[index: string]: any;
  auth: any;
  setAuth: Dispatch<SetStateAction<any>>;
  isLoggedIn: boolean;
  setIsLoggeedIn: Dispatch<SetStateAction<any>>;
  isLoading?: boolean;
  setIsLoading: Dispatch<SetStateAction<any>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggeedIn] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<any>(() => {
    const stored = sessionStorage.getItem("auth");
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    if (auth) {
      sessionStorage.setItem("auth", JSON.stringify(auth));
    } else {
      sessionStorage.removeItem("auth");
    }
  }, [auth]);

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isLoggedIn,
        setIsLoggeedIn,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
