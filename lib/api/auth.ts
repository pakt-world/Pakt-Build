/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type UseMutationResult, UseQueryResult, useMutation, useQuery } from "@tanstack/react-query";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type ApiError, axios } from "@/lib/axios";
import { toast } from "@/components/common/toaster";
import { useWalletState } from "../store/wallet";
import { TwoFactorAuthEnums } from "../enums";

// Signup

interface SignupResponse {
	email: string;
	tempToken: {
		token: string;
		expiresIn: number;
	};
}

interface SignupParams {
	email: string;
	password: string;
	confirmPassword: string;
	lastName?: string;
	firstName: string;
	referral?: string;
}

async function postSignUp({
	email,
	password,
	confirmPassword,
	firstName,
	lastName,
	referral,
}: SignupParams): Promise<SignupResponse> {
	const res = await axios.post("/auth/create-account", {
		email,
		password,
		confirmPassword,
		lastName,
		firstName,
		referral,
	});
	return res.data.data as SignupResponse;
}

export function useSignUp(): UseMutationResult<SignupResponse, ApiError, SignupParams> {
	return useMutation({
		mutationFn: postSignUp,
		mutationKey: ["signup"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Verify Email

interface VerifyEmailResponse {
	token: string;
	expiresIn: number;
	timeZone?: string;
}

interface VerifyEmailParams {
	otp: string;
	token: string;
}

async function postVerifyEmail({ otp, token }: VerifyEmailParams): Promise<VerifyEmailResponse> {
	const res = await axios.post("/auth/account/verify", {
		token: otp,
		tempToken: token,
	});
	return res.data.data as VerifyEmailResponse;
}

export function useVerifyEmail(): UseMutationResult<VerifyEmailResponse, ApiError, VerifyEmailParams> {
	return useMutation({
		mutationFn: postVerifyEmail,
		mutationKey: ["verify-email"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Resend OTP

interface ResendOTPResponse {
	token: string;
	expiresIn: number;
}

interface ResendOTPParams {
	email: string;
}

async function postResendOTP({ email }: ResendOTPParams): Promise<ResendOTPResponse> {
	const res = await axios.post("/auth/verify/resend", { email });
	return res.data.data as ResendOTPResponse;
}

export function useResendOTP(): UseMutationResult<ResendOTPResponse, ApiError, ResendOTPParams> {
	return useMutation({
		mutationFn: postResendOTP,
		mutationKey: ["resend-otp"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			toast.success("OTP sent successfully");
		},
	});
}

// Login
interface LoginResponse {
	email: string;
	token?: string;
	tempToken?: {
		token: string;
	};
	isVerified?: boolean;
	twoFa?: {
		status: boolean;
		type: TwoFactorAuthEnums;
	};
	timeZone?: string;
	meta?: Record<string, unknown>;
}

interface LoginParams {
	email: string;
	password: string;
}
interface Login2FAParams {
	code: string;
	tempToken: string;
}

async function postLogin({ email, password }: LoginParams): Promise<LoginResponse> {
	const res = await axios.post("/auth/login", { email, password });
	return res.data.data as LoginResponse;
}

async function postLogin2FA({ code, tempToken }: Login2FAParams): Promise<LoginResponse> {
	const res = await axios.post("/auth/login/2fa", { code, tempToken });
	return res.data.data as LoginResponse;
}

export function useLogin(): UseMutationResult<LoginResponse, ApiError, LoginParams> {
	const { setWallet } = useWalletState();

	return useMutation({
		mutationFn: postLogin,
		mutationKey: ["login"],
		onError: (error: ApiError) => {
			// axios will handle this if it's a timeout error
			if (error.message !== "timeout of 30000ms exceeded")
				toast.error(error?.response?.data.message ?? "An error occurred");
		},
		onSuccess: () => {
			setWallet({
				totalBalance: "0.00",
				value: "0.00",
				wallets: [],
			});
		},
	});
}

export function useLoginOTP(): UseMutationResult<LoginResponse, ApiError, Login2FAParams> {
	return useMutation({
		mutationFn: postLogin2FA,
		mutationKey: ["login_2fa"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// reset Password

interface ResetPasswordParams {
	email: string;
}

interface ResetPasswordResponse {
	message: string;
	tempToken: {
		token: string;
		expiresIn: number;
	};
}

async function postRequestPasswordReset({ email }: ResetPasswordParams): Promise<ResetPasswordResponse> {
	const res = await axios.post("/auth/password/reset", { email });
	return res.data.data as ResetPasswordResponse;
}

export function useRequestPasswordReset(): UseMutationResult<ResetPasswordResponse, ApiError, ResetPasswordParams> {
	return useMutation({
		mutationFn: postRequestPasswordReset,
		mutationKey: ["request-reset-password"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

interface VerifyResetPasswordParams {
	token: string;
	tempToken: string;
}

interface VerifyResetPasswordResponse {
	message: string;
	tempToken: {
		token: string;
		expiresIn: number;
	};
}

async function postVerifyPasswordReset({
	tempToken,
	token,
}: VerifyResetPasswordParams): Promise<VerifyResetPasswordResponse> {
	const res = await axios.post("/auth/password/validate", {
		tempToken,
		token,
	});
	return res.data.data as VerifyResetPasswordResponse;
}

export function useVerifyResetPassword(): UseMutationResult<
	VerifyResetPasswordResponse,
	ApiError,
	VerifyResetPasswordParams
> {
	return useMutation({
		mutationFn: postVerifyPasswordReset,
		mutationKey: ["verify-reset-password"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

interface ResetAccountPasswordParams {
	token: string;
	tempToken: string;
	password: string;
}

interface ResetAccountPasswordResponse {
	message: string;
}

async function postAccountPasswordReset({
	tempToken,
	token,
	password,
}: ResetAccountPasswordParams): Promise<ResetAccountPasswordResponse> {
	const res = await axios.post("/auth/password/change", {
		tempToken,
		token,
		password,
	});
	return res.data.data as ResetAccountPasswordResponse;
}

export function useResetPassword(): UseMutationResult<
	ResetAccountPasswordResponse,
	ApiError,
	ResetAccountPasswordParams
> {
	return useMutation({
		mutationFn: postAccountPasswordReset,
		mutationKey: ["account-reset-password"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

// Google Auth

// Generate Google State
interface GenerateGoogleAuthResponse {
	state: string;
	googleAuthUrl: string;
}

async function generateGoogleAuth(): Promise<GenerateGoogleAuthResponse> {
	const res = await axios.get("/auth/google/oauth/generate-state");
	return res.data.data;
}

export function useGenerateGoogleAuth({
	enable = true,
}: {
	enable?: boolean;
}): UseQueryResult<GenerateGoogleAuthResponse, ApiError> {
	return useQuery({
		queryKey: ["generate-google-auth"],
		queryFn: generateGoogleAuth,
		enabled: enable,
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}

interface VerifyGoogleAuthParams {
	state: string;
	code: string;
}

interface VerifyResetPasswordResponse {
	token: string;
	token_type: string;
	expiresIn: number;
	isVerified: boolean;
}

async function postVerifyGoogleAuth({ state, code }: VerifyGoogleAuthParams): Promise<VerifyResetPasswordResponse> {
	const res = await axios.post(`/auth/google/oauth/validate-state?state=${state}&code=${code}`);
	return res.data.data;
}

export function useVerifyGoogleAuth(): UseMutationResult<
	VerifyResetPasswordResponse,
	ApiError,
	VerifyGoogleAuthParams
> {
	return useMutation({
		mutationFn: postVerifyGoogleAuth,
		mutationKey: ["verify-google-auth"],
		onError: (error: ApiError) => {
			toast.error(error?.response?.data.message ?? "An error occurred");
		},
	});
}
