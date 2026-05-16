import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { useEffect } from "react";
import api from "../api/axios";
import type { InternalAxiosRequestConfig } from "axios";

const useAxiosPrivate = () => {
  const { auth, setAuth } = useAuth();
  const refresh = useRefreshToken();

  useEffect(() => {
    const requestIntercept: any = api.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (auth?.accessToken) {
          config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (err: any) => Promise.reject(err),
    );

    const responseIntercept: any = api.interceptors.response.use(
      (response) => response,
      async (err: any) => {
        const prevRequest = err?.config;
        if (err?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          const newAccessToken = await refresh();
          setAuth((prev: any) => ({
            ...prev,
            accessToken: newAccessToken,
          }));
        }
        return Promise.reject(err);
      },
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);
  return api;
};

export default useAxiosPrivate;
