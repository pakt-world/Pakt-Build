/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { REDIRECT_STORAGE_KEY } from "@/hooks/use-view-mode-redirect";
import { AuthEnums, TwoFactorAuthEnums, VerifyTypesEnums } from "@/lib/enums";
import { AUTH_TOKEN_KEY, TIMEZONE_KEY, VERIFY_LOGIN_KEY, VERIFY_SIGNUP_KEY } from "@/lib/utils";

// interface AuthResponseData {
// 	email: string;
// 	tempToken?: {
// 		token: string;
// 	};
// 	isVerified?: boolean;
// 	twoFa?: {
// 		status: boolean;
// 		type: TwoFactorAuthEnums;
// 	};
// 	timeZone?: string;
// 	token?: string;
// }

interface LoginResponse {
	email: string;
	token: string;
	type: TwoFactorAuthEnums;
	verifyType: VerifyTypesEnums;
}

interface SignUpResponse {
	email: string;
	token: string;
	verifyType: VerifyTypesEnums;
}

export const handleAuthResponse = ({
	data,
	isMobile,
	router,
	// SignIn
	isSignIn = false,
	setLoginResponse,
	isGoogleSignIn = false,
	// SignUp
	isSignUp = false,
	setSignUpResponse,
	isGoogleSignup = false,
}: {
	data: any;
	isMobile: boolean;
	router: ReturnType<typeof useRouter>;
	// SignIn
	isSignIn?: boolean;
	setLoginResponse?: (payload: LoginResponse) => void;
	isGoogleSignIn?: boolean;
	// SignUp
	isSignUp?: boolean;
	setSignUpResponse?: (payload: SignUpResponse) => void;
	isGoogleSignup?: boolean;
}) => {
	const { email, tempToken, isVerified, twoFa, timeZone, token } = data;

	// Get the last viewed job ID from localStorage
	const redirectPath = localStorage.getItem(REDIRECT_STORAGE_KEY);

	console.log("====>", {
		isSignIn,
		isSignUp,
		isGoogleSignIn,
		isGoogleSignup,
		isVerified,
		isMobile,
		redirectPath,
		email,
		token,
		timeZone,
		tempToken,
		twoFa,
	});

	if (isSignIn) {
		if (!isVerified) {
			if (isMobile) {
				const mpayload: SignUpResponse = {
					email,
					token: tempToken?.token ?? "",
					verifyType: VerifyTypesEnums.EMAIL,
				};
				const userString = JSON.stringify(mpayload);
				setCookie(VERIFY_SIGNUP_KEY, userString);
				return router.push(`/${AuthEnums.VERIFY_SIGNUP}`);
			}

			setSignUpResponse?.({
				email: email,
				token: tempToken?.token ?? "",
				verifyType: VerifyTypesEnums.EMAIL,
			});
			return router.push(`/?auth=${AuthEnums.VERIFY_SIGNUP}`);
		}

		if (twoFa?.status && !isGoogleSignIn) {
			const mpayload: LoginResponse = {
				email,
				token: tempToken?.token ?? "",
				type: twoFa.type,
				verifyType: VerifyTypesEnums.TwoFa,
			};
			setLoginResponse?.(mpayload);

			if (isMobile) {
				const userString = JSON.stringify(mpayload);
				setCookie(VERIFY_LOGIN_KEY, userString);
				return router.push(`/${AuthEnums.VERIFY_2FA}`);
			}
			return router.push(`/?auth=${AuthEnums.VERIFY_2FA}`);
		}

		if (redirectPath) {
			router.push(redirectPath);
			localStorage.removeItem(REDIRECT_STORAGE_KEY);
		} else {
			router.push("/dashboard");
		}
		// Set Timezone to localStorage
		if (timeZone) {
			localStorage.setItem(TIMEZONE_KEY, timeZone);
		}
		if (token) {
			setCookie(AUTH_TOKEN_KEY, token);
		}
	}

	if (isSignUp) {
		if (isMobile) {
			const mpayload: SignUpResponse = {
				email,
				token: tempToken?.token ?? "",
				verifyType: VerifyTypesEnums.EMAIL,
			};
			const userString = JSON.stringify(mpayload);
			setCookie(VERIFY_SIGNUP_KEY, userString);
			router.push(`/${AuthEnums.VERIFY_SIGNUP}`);
		} else {
			setSignUpResponse?.({
				email,
				token: tempToken?.token ?? "",
				verifyType: VerifyTypesEnums.EMAIL,
			});
			router.push(`/?auth=${AuthEnums.VERIFY_SIGNUP}`);
		}

		// Set Timezone to localStorage
		if (timeZone) {
			localStorage.setItem(TIMEZONE_KEY, timeZone);
		}
		if (token) {
			setCookie(AUTH_TOKEN_KEY, token);
		}
	}
};
