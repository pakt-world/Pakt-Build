/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

interface ShowWalletAddressProps {
	showWalletAddress: boolean;
	setShowWalletAddress: (showWalletAddress: boolean) => void;
	showPrivateKeyFlow: boolean;
	setShowPrivateKeyFlow: (showPrivateKey: boolean) => void;
	passwordValue: string;
	setPasswordValue: (passwordValue: string) => void;
	secretKey: string;
	setSecretKey: (secretKey: string) => void;
	isOtp: boolean;
	setIsOtp: (isOtp: boolean) => void;
}

export const useShowWalletAddressStore = create<ShowWalletAddressProps>((set) => ({
	showWalletAddress: false,
	setShowWalletAddress: (showWalletAddress: boolean) => {
		set({ showWalletAddress });
	},
	showPrivateKeyFlow: false,
	setShowPrivateKeyFlow: (showPrivateKeyFlow: boolean) => {
		set({ showPrivateKeyFlow });
	},
	passwordValue: "",
	setPasswordValue: (passwordValue: string) => {
		set({ passwordValue });
	},
	secretKey: "",
	setSecretKey: (secretKey: string) => {
		set({ secretKey });
	},
	isOtp: false,
	setIsOtp: (isOtp: boolean) => {
		set({ isOtp });
	},
}));
