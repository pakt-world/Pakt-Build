/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// KYC

interface KycState {
	openKycModal: boolean;
	setOpenKycModal: (openKycModal: boolean) => void;
	disableClickOutside: boolean;
	setDisableClickOutside: (disableClickOutside: boolean) => void;
}

export const useKyc = create<KycState>((set) => ({
	openKycModal: false,
	setOpenKycModal: (openKycModal: boolean) => {
		set({ openKycModal });
	},
	disableClickOutside: false,
	setDisableClickOutside: (disableClickOutside: boolean) => {
		set({ disableClickOutside });
	},
}));
