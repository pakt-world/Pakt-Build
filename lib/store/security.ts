/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { TwoFactorAuthEnums, VerifyTypesEnums } from "../enums";

// App2FA
interface AuthApp2FA {
	isModalOpen: boolean;
	closeModal: () => void;
	openModal: () => void;
	secret: string;
	setSecret: (secret: string) => void;
	qrCode: string;
	setQrCode: (qrCode: string) => void;
}

export const useAuthApp2FAState = create<AuthApp2FA>((set) => ({
	isModalOpen: false,
	openModal: () => {
		set({ isModalOpen: true });
	},
	closeModal: () => {
		set({ isModalOpen: false });
	},
	secret: "",
	setSecret: (secret: string) => {
		set({ secret });
	},
	qrCode: "",
	setQrCode: (qrCode: string) => {
		set({ qrCode });
	},
}));

// Email 2FA state
interface Email2FAState {
	isModalOpen: boolean;
	closeModal: () => void;
	openModal: () => void;
}

export const useEmail2FAState = create<Email2FAState>((set) => ({
	isModalOpen: false,
	openModal: () => {
		set({ isModalOpen: true });
	},
	closeModal: () => {
		set({ isModalOpen: false });
	},
}));

// Security Question State
interface SecurityQuestion2FAState {
	isModalOpen: boolean;
	securityQuestions: string[];
	setSecurityQuestions: (securityQuestions: string[]) => void;
	closeModal: () => void;
	openModal: () => void;
}

export const useSecurityQuestion2FAState = create<SecurityQuestion2FAState>((set) => ({
	isModalOpen: false,
	securityQuestions: [],
	setSecurityQuestions: (securityQuestions: string[]) => {
		set({ securityQuestions });
	},
	openModal: () => {
		set({ isModalOpen: true });
	},
	closeModal: () => {
		set({ isModalOpen: false });
	},
}));

interface MscState {
	isInput6DigitCode?: boolean;
	setIsInput6DigitCode?: (value: boolean) => void;
}

export const useMscState = create<MscState>((set) => ({
	isInput6DigitCode: false,
	setIsInput6DigitCode: (value) => {
		set(() => ({ isInput6DigitCode: value }));
	},
}));

// ================ Authentication ================ //

// Login
interface LoginDialogState {
	loginResponse: {
		email: string;
		token: string;
		type: TwoFactorAuthEnums;
		verifyType: VerifyTypesEnums;
	};
	setLoginResponse: (response: {
		email: string;
		token: string;
		type: TwoFactorAuthEnums;
		verifyType: VerifyTypesEnums;
	}) => void;
}

export const useLoginDialogState = create<LoginDialogState>((set) => ({
	loginResponse: {
		email: "",
		token: "",
		type: TwoFactorAuthEnums.EMPTY,
		verifyType: VerifyTypesEnums.EMPTY,
	},
	setLoginResponse: (response: {
		email: string;
		token: string;
		type: TwoFactorAuthEnums;
		verifyType: VerifyTypesEnums;
	}) => {
		set({ loginResponse: response });
	},
}));

// Signup

interface SignUpDialogState {
	signUpResponse: {
		email: string;
		token: string;
		verifyType: VerifyTypesEnums;
	};
	setSignUpResponse: (response: { email: string; token: string; verifyType: VerifyTypesEnums }) => void;
	// Terms & Condition
	agreed: boolean;
	setAgreed: (agreed: boolean) => void;
}

export const useSignUpDialogState = create<SignUpDialogState>((set) => ({
	signUpResponse: {
		email: "",
		token: "",
		verifyType: VerifyTypesEnums.EMPTY,
	},
	setSignUpResponse: (response: { email: string; token: string; verifyType: VerifyTypesEnums }) => {
		set({ signUpResponse: response });
	},
	// Terms & Condition
	agreed: false,
	setAgreed: (agreed: boolean) => {
		set({ agreed });
	},
}));

// Forgot Password
interface ForgotPasswordDialogState {
	forgotPasswordResponse: {
		email: string;
		token: string;
	};
	setForgotPasswordResponse: (response: { email: string; token: string }) => void;
	// Verify Email &  Reset Password
	otp: string;
	setOtp: (otp: string) => void;
}

export const useForgotPasswordDialogState = create<ForgotPasswordDialogState>((set) => ({
	forgotPasswordResponse: {
		email: "",
		token: "",
	},
	setForgotPasswordResponse: (response: { email: string; token: string }) => {
		set({ forgotPasswordResponse: response });
	},
	// Verify Email
	otp: "",
	setOtp: (otp: string) => {
		set({ otp });
	},
}));
