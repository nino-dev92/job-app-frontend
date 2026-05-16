import useAuth from "./useAuth";
import api from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response: any = await api.get("/auth/refresh");
    const accessToken = response?.data?.accessToken;
    setAuth((prev: any) => {
      return { ...prev, accessToken };
    });
    console.log(response);
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken;
