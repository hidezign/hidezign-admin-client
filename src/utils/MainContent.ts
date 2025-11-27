// src/utils/MainContent.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { store } from "../Redux/store";
// If you have RootState exported from your store, import it:
// import type { RootState } from "../Redux/store";

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
  AppLogo: "https://res.cloudinary.com/ds8buve4c/image/upload/v1764232690/logo_fie7dg.svg",
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
  // base: "http://localhost:3000/api/v1",
  // origin: "http://localhost:3000",
  base: "https://api.hidezign.com/api/v1",
  origin: "https://api.hidezign.com",
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
    // If you have a typed RootState, replace `any` with RootState:
    // const state = store.getState() as RootState;
    const state = store.getState() as any;
    const token = state?.auth?.token;

    if (token) {
      // Option A: Mutate the existing headers object if present (preferred)
      if (config.headers && typeof config.headers === "object") {
        const headers = config.headers as AxiosRequestHeaders;
        headers.Authorization = `Bearer ${token}`;
        config.headers = headers;
      } else {
        // Option B: No headers present — create a typed headers object
        config.headers = { Authorization: `Bearer ${token}` } as AxiosRequestHeaders;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);
