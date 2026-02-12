"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */
import { Table } from "@/components/common/table";
import { useGetWalletTxs } from "@/lib/api/wallet";
import { parseTransactionHash } from "@/lib/utils/wallet";
import { formatDateHandler, formatUsd, walletPageRefetchInterval } from "@/lib/utils";
import { TransactionProps } from "@/lib/types/wallet";

import { TABLE_COLUMNS } from "./_components/columns";
import { TransactionStatus } from "@/lib/enums";
import { useSettingState } from "@/lib/store/settings";
import { ShowWalletAddress } from "@/widgets/wallet/desktop/_components/transactions/_components/show-wallet-address";

const dateFormat = "MM/DD/YYYY";
const MAX = 20;

export const WalletTransactions4Desktop = (): JSX.Element => {
	const { settings } = useSettingState();
	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 1,
		pageSize: 6,
	});
	const {
		data: walletTx,
		refetch: fetchWalletTx,
		// isLoading,
		isFetched: walletFetched,
		isFetching: walletIsFetching,
	} = useGetWalletTxs({
		limit: pageSize,
		page: pageIndex,
		filters: {
			status: [TransactionStatus.PROCESSING, TransactionStatus.COMPLETED, TransactionStatus.REPROCESSING],
		},
		refetchInterval: walletPageRefetchInterval,
	});
	const loading = !walletFetched && walletIsFetching;
	const page = parseInt(walletTx?.page ?? "1", 10);
	const pageSizee = parseInt(walletTx?.pages ?? "1", 10);

	const walletTransactions = useMemo(
		() =>
			(walletTx?.transactions ?? [])
				.map((tx: TransactionProps) => ({
					date: formatDateHandler(tx.createdAt, dateFormat),
					type: {
						type: tx.type,
						coin: tx.coin,
					},
					amount: String(tx.amount),
					description:
						tx.description && tx.description?.length > MAX
							? `${tx.description.slice(0, MAX)}...`
							: tx.description,
					usdValue: tx.rate ? formatUsd(Number(tx.rate) * tx.amount) : formatUsd(tx.usdValue),
					status: tx.status,
					transactionHash: parseTransactionHash(tx),
				}))
				.sort((a, b) => new Date(b?.date).getTime() - new Date(a?.date).getTime()),
		[walletTx]
	);
	const data = walletTransactions.map((transaction) => ({
		...transaction,
		transactionHash:
			typeof transaction.transactionHash === "string"
				? transaction.transactionHash
				: JSON.stringify(transaction.transactionHash), // Convert to string if it's an object
	}));

	const loadPage = async (): Promise<void> => {
		await Promise.all([fetchWalletTx()]);
	};

	const columns = useMemo(() => TABLE_COLUMNS({ snowtraceBaseUrl: settings?.SNOWTRACE_URL || "" }), [settings]);

	useEffect(() => {
		void loadPage();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		void fetchWalletTx();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pageIndex, pageSize]);
	return (
		<div className="flex h-[600px] w-full max-w-full flex-col gap-4 rounded-lg border border-line bg-white px-6 py-6 shadow">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-semibold">Wallet Transactions</h3>
				<ShowWalletAddress />
			</div>
			<Table
				data={data}
				columns={columns}
				pageCount={pageSizee}
				setPagination={setPagination}
				pagination={{ pageIndex: page, pageSize: pageSizee }}
				loading={loading}
			/>
		</div>
	);
};
