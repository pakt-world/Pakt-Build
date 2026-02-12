/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { create } from "zustand";
import { persist } from "zustand/middleware";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { USER_WALLET_KEY } from "../utils";

export interface IWallet {
	totalBalance: string | number;
	value: string;
	wallets:
		| Array<{
				_id?: string;
				id?: string;
				amount: number;
				usdValue: number;
				coin: string;
				icon: string;
				address?: string;
		  }>
		| [];
}

type WalletState = {
	wallet: IWallet;
	setWallet: (wallet: IWallet) => void;
};

export const useWalletState = create<WalletState>()(
	persist(
		(set) => ({
			wallet: {
				totalBalance: "0.00",
				value: "0.00",
				wallets: [],
			},
			setWallet: (wallet) => {
				set({ wallet });
			},
		}),
		{
			name: USER_WALLET_KEY,
		}
	)
);
