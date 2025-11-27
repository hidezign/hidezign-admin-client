import { Axios } from "../utils/MainContent";
import { AxiosError } from "axios";

export const adminApi = "/admin";


export interface LoginPayload {
    email: string;
    password: string;
}

export interface SignUpPayload {
    username: string;
    email: string;
    password: string;
}

export interface LoginSuccessResponse {
    token: string;
    user: any;       // replace with your User type
    role: string;
    message?: string;
}

export interface ErrorResponse {
    status: boolean;
    message: string;
    [key: string]: any;
}


export async function loginAdmin(payload: LoginPayload) {
    try {
        const response = await Axios.post(`${adminApi}/login`, payload);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}


export async function signUpAdmin(payload: SignUpPayload) {
    try {
        const response = await Axios.post(`${adminApi}/signup`, payload);
        return response?.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}


export async function adminProfile() {
    try {
        const response = await Axios.get(`${adminApi}/profile`);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}



export async function getAllProjects() {
    try {
        const response = await Axios.get(`${adminApi}/projects`);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }

}


export async function createProject(payload: any) {
    try {
        const response = await Axios.post(`${adminApi}/project`, payload);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}

export async function deleteProject(projectId: string){
    try{
        const response = await Axios.delete(`${adminApi}/project/${projectId}`);
        return response.data;

    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}


export async function getProjectDetails(projectId: string){
    try {
        const response = await Axios.get(`${adminApi}/project/${projectId}`);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}


export async function updateProject(projectId: string, payload: any){
    try {
        const response = await Axios.put(`${adminApi}/project/${projectId}`, payload);
        return response.data;
    } catch (err) {
        const error = err as AxiosError<ErrorResponse>;
        return error.response?.data || {
            status: false,
            message: "Something went wrong",
        };
    }
}