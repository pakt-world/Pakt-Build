"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Kyc } from "@/components/dialogs/kyc";
import { MobileWalletTransactions } from "@/widgets/wallet/mobile/_components/transactions";
import { TotalWalletBalance } from "@/widgets/wallet/_shared/wallet-balance";
import { ShowWalletAddress } from "@/widgets/wallet/desktop/_components/transactions/_components/show-wallet-address";
import { WalletProps } from "@/lib/api/wallet";
import { TopToken4Mobile } from "./_components/top-token";

interface Wallet4MobileProps {
	wallets: WalletProps[];
	totalWalletBalance: string | number;
	refetchWalletData: () => void;
}

const Wallet4Mobile = ({ wallets, totalWalletBalance, refetchWalletData }: Wallet4MobileProps) => {
	return (
		<div className="flex size-full flex-col overflow-x-hidden">
			<Kyc />
			<div className="fixed top-[70px] z-20 flex w-full flex-col bg-white">
				<div className="flex flex-col items-start">
					<TotalWalletBalance
						wallets={wallets}
						totalWalletBalance={totalWalletBalance}
						refetchWalletData={refetchWalletData}
					/>
					<TopToken4Mobile wallets={wallets} />
				</div>
				<div className="flex items-center justify-between border-b border-line px-5 py-2">
					<h3 className="text-base font-semibold">Wallet Transactions</h3>
					<ShowWalletAddress />
				</div>
			</div>
			<MobileWalletTransactions />
		</div>
	);
};

export default Wallet4Mobile;
