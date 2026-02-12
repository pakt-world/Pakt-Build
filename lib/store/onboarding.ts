/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";

// App2FA
interface OnboardingState {
	skill: string;
	image: string;
	setSkill: (skill: string) => void;
	setProfileImage: (image: string) => void;
}

export const useOnboardingState = create<OnboardingState>((set) => ({
	skill: "",
	image: "",
	setSkill: (skill: string) => {
		set({ skill });
	},
	setProfileImage: (image: string) => {
		set({ image });
	},
}));

interface OnboardingActionState {
	showOnboardingDialog: boolean;
	setShowOnboardingDialog: (show: boolean) => void;
}

export const useOnboardingActionState = create<OnboardingActionState>((set) => ({
	showOnboardingDialog: false,
	setShowOnboardingDialog: (show: boolean) => {
		set({ showOnboardingDialog: show });
	},
}));
