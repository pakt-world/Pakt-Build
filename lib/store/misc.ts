/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { ExchangeRateRecord } from "../api/wallet";

interface ExchangeRateStoreProps {
	data: ExchangeRateRecord | undefined;
	setData: (data: ExchangeRateRecord) => void;
}

export const useExchangeRateStore = create<ExchangeRateStoreProps>((set) => ({
	data: undefined,
	setData: (data: ExchangeRateRecord) => {
		set({ data });
	},
}));

interface LogoutConfirmationStoreProps {
	showLogoutConfirmation: boolean;
	setShowLogoutConfirmation: (showLogoutConfirmation: boolean) => void;
	enableAccountFetch: boolean;
	setEnableAccountFetch: (enableAccountFetch: boolean) => void;
}

export const useLogoutConfirmationStore = create<LogoutConfirmationStoreProps>((set) => ({
	showLogoutConfirmation: false,
	setShowLogoutConfirmation: (showLogoutConfirmation: boolean) => {
		set({ showLogoutConfirmation });
	},

	// For Account
	enableAccountFetch: false,
	setEnableAccountFetch: (enableAccountFetch: boolean) => {
		set({ enableAccountFetch });
	},
}));
