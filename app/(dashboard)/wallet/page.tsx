"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { useGetWalletDetails, type WalletProps } from "@/lib/api/wallet";
import { walletPageRefetchInterval } from "@/lib/utils";
import Wallet4Mobile from "@/widgets/wallet/mobile";
import Wallet4Desktop from "@/widgets/wallet/desktop";

export default function WalletPage(): JSX.Element {
	const isMobile = useMediaQuery("(max-width: 640px)");

	const { data: walletData, refetch: refetchWalletData } = useGetWalletDetails({
		refreshInterval: walletPageRefetchInterval,
	});

	const wallets: WalletProps[] = useMemo(() => walletData?.wallets ?? [], [walletData]);

	const totalWalletBalance: string | number = walletData?.totalBalance ?? 0.0;

	const loadPage = async (): Promise<void> => {
		await Promise.all([refetchWalletData()]);
	};

	useEffect(() => {
		loadPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return isMobile ? (
		<Wallet4Mobile
			wallets={wallets}
			totalWalletBalance={totalWalletBalance}
			refetchWalletData={refetchWalletData}
		/>
	) : (
		<Wallet4Desktop
			wallets={wallets}
			totalWalletBalance={totalWalletBalance}
			refetchWalletData={refetchWalletData}
		/>
	);
}
