import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import logo from "../assets/logo.svg";
import { store } from "../Redux/store";

/* ----------------------------------------------------
   Types
---------------------------------------------------- */

export interface MainContentType {
  AppName: string;
  AppLogo: string;
  Email: string;
  DribbbleLink: string;
  LinkedInLink: string;
  InstagramLink: string;
  TwitterLink: string;
  BehanceLink: string;
}

export interface BackendConfigType {
  base: string;
  origin: string;
}

/* ----------------------------------------------------
   Main Content
---------------------------------------------------- */

export const MainContent: MainContentType = {
  AppName: "Hi Dezign",
  AppLogo: logo,
  Email: "hello@hidezign.com",
  DribbbleLink: "",
  LinkedInLink: "",
  InstagramLink: "",
  TwitterLink: "",
  BehanceLink: "",
};

/* ----------------------------------------------------
   Backend Config
---------------------------------------------------- */

export const backendConfig: BackendConfigType = {
  base: "http://localhost:3000/api/v1",
  origin: "http://localhost:3000",
  // base: "https://api.hidezign.com/api/v1",
  // origin: "https://api.hidezign.com",
};

/* ----------------------------------------------------
   Axios Instance
---------------------------------------------------- */

export const Axios: AxiosInstance = axios.create({
  baseURL: backendConfig.base,
  withCredentials: true,
});

/* ----------------------------------------------------
   Axios Interceptor
---------------------------------------------------- */

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const state = store.getState() as any;
    const token = state?.auth?.token;

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);
