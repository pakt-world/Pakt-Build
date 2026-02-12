"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn, formatUsd } from "@/lib/utils";
import { useWalletState } from "@/lib/store/wallet";
import { useGetWalletDetails } from "@/lib/api/wallet";

interface Props {
	className?: string;
}

export const UserBalance: FC<Props> = ({ className }) => {
	const { wallet } = useWalletState();
	const { totalBalance } = wallet;

	const { refetch } = useGetWalletDetails({});
	useEffect(() => {
		void refetch();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return (
		<span className={cn("text-lg font-bold text-title sm:text-3xl", className)}>
			{formatUsd(parseFloat((totalBalance as string) ?? "0"))}
		</span>
	);
};
