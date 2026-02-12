"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { WalletBalanceChart } from "@/widgets/wallet/desktop/_components/chart";
import { Kyc } from "@/components/dialogs/kyc";
import { WalletTransactions4Desktop } from "@/widgets/wallet/desktop/_components/transactions";
import { TotalWalletBalance } from "@/widgets/wallet/_shared/wallet-balance";
import { WalletProps } from "@/lib/api/wallet";
import { TopToken4Desktop } from "./_components/top-token";

interface Wallet4DesktopProps {
	wallets: WalletProps[];
	totalWalletBalance: string | number;
	refetchWalletData: () => void;
}

const Wallet4Desktop = ({ wallets, totalWalletBalance, refetchWalletData }: Wallet4DesktopProps) => {
	return (
		<div className="flex size-full flex-col overflow-y-auto overflow-x-hidden sm:gap-[36px] xl:px-4 2xl:px-8">
			<Kyc />
			<div className="sm:w-ful flex flex-col sm:grid sm:grid-cols-2 sm:items-stretch sm:gap-6 sm:px-4">
				<div className="flex flex-col items-start sm:mb-4 sm:gap-2">
					<TotalWalletBalance
						wallets={wallets}
						totalWalletBalance={totalWalletBalance}
						refetchWalletData={refetchWalletData}
					/>
					<TopToken4Desktop wallets={wallets} />
				</div>
				<WalletBalanceChart />
			</div>
			<WalletTransactions4Desktop />
		</div>
	);
};

export default Wallet4Desktop;
