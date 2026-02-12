"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import Axios, {
	type AxiosRequestConfig,
	type AxiosInstance,
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { deleteCookie, getCookie } from "cookies-next";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { AUTH_TOKEN_KEY, getRequestSignature } from "./utils";
import { queue } from "./request-queue";
import { toast } from "@/components/common/toaster";
import Logger from "./utils/logger";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://default-api-url.com";
const REQUEST_TIMEOUT = 30000; // Configurable timeout = 30 seconds timeout

if (!API_URL) {
	throw new Error("API_URL is not defined in the environment variables");
}

export const axios: AxiosInstance = Axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: REQUEST_TIMEOUT,
});

export const axiosDefault = Axios.create({
	headers: { "Access-Control-Allow-Origin": "*" },
	responseType: "json",
});

// Utility function for adding required headers
const addSignatureHeaders = (request: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
	const uri = request.url;
	const mainUrl = String(`/v1${uri?.split("?")[0]}`);
	const { timeStamp, signature } = getRequestSignature(mainUrl);
	const authToken = getCookie(AUTH_TOKEN_KEY);

	request.headers["x-signature"] = signature;
	request.headers["x-timestamp"] = timeStamp;

	if (!request.headers["Authorization"] && authToken) {
		request.headers["Authorization"] = `Bearer ${authToken}`;
	}

	return request;
};

axios.interceptors.request.use(addSignatureHeaders, (error) => Promise.reject(error));

// Utility function for handling errors
const handleErrorResponse = async (error: AxiosError): Promise<void> => {
	if (error.response) {
		const { status } = error.response;
		const currentPath = window.location.pathname;

		if (status === 401 && currentPath !== "/") {
			deleteCookie(AUTH_TOKEN_KEY);
			window.location.replace("/");
		} else if (error.message.includes(`timeout of ${REQUEST_TIMEOUT}ms exceeded`)) {
			toast.info("Request timeout, please try again in a few minutes");
		} else {
			if (currentPath !== "/" && currentPath !== "/login" && currentPath !== "/signup") {
				// toast.error("An unexpected error occurred. Please try again.");
				Logger.error("An unexpected error occurred. Please try again.");
			}
		}
	}
	return Promise.reject(error);
};

axios.interceptors.response.use((response) => response, handleErrorResponse);

export type ApiResponse<T = unknown> = AxiosResponse<{
	message: string;
	data: T;
}>;

export type ApiError<T = unknown> = AxiosError<{
	message: string;
	data?: T;
}>;

export const requestQueue = async <T>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> => {
	return new Promise((resolve, reject) => {
		queue.addTask(async () => {
			try {
				const response = await axios.request<T>(config);
				resolve(response);
			} catch (error) {
				reject(error);
			}
		});
	});
};
