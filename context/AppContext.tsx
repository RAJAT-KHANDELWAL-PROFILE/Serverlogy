import { createContext, ReactNode, useEffect, useRef, useState } from "react";
import AppContextInterface from "./AppContextInterface";
import UserInterface from "../interface/UserInterface";
import axiosClient from "../utils/axiosClient";
import BASE_URL from "../utils/BaseURL";

export const AppContext = createContext<AppContextInterface>(
  {} as AppContextInterface
);

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
  const [loading, setLoading] = useState<Boolean>(true);
  const [user, setUser] = useState<UserInterface | null>(null);
  const [userSetted, setUserSetted] = useState<Boolean>(false);
  const isUserSet = useRef(true);

  const getUser = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get(BASE_URL + "/user/get");
      setUser(data.user);
      setLoading(false);
      setUserSetted(true);
    } catch {
      setLoading(false);
      setUserSetted(true);
    }
  };

  useEffect(() => {
    if (isUserSet.current) {
      isUserSet.current = false;
      getUser();
    }
  }, []);

  const context: AppContextInterface = {
    loading: {
      value: loading,
      set: setLoading,
    },
    user: {
      value: user,
      set: setUser,
      isSet: userSetted,
    },
    refreshUser: getUser,
  };

  
  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
