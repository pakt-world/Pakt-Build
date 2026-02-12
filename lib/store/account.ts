import { create } from "zustand";
import { persist } from "zustand/middleware";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { type AccountProps } from "@/lib/types/account";
import { TIMEZONE_KEY, USER_STORAGE_KEY, USER_WALLET_KEY, SYSTEM_SETTINGS_KEY } from "../utils";

type UserState = {
	user: AccountProps | null;
	setUser: (user: AccountProps | null) => void;
	clearStore: () => void;
};

export const useUserState = create<UserState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user: AccountProps | null) => set({ user }),
			clearStore: () => {
				set({ user: null });
				localStorage.removeItem(USER_STORAGE_KEY);
				localStorage.removeItem(USER_WALLET_KEY);
				localStorage.removeItem(TIMEZONE_KEY);
				localStorage.removeItem(SYSTEM_SETTINGS_KEY);
			},
		}),
		{
			name: USER_STORAGE_KEY,
		}
	)
);
