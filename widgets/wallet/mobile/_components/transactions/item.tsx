/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { cn, formatDateHandler } from "@/lib/utils";
import { useSettingState } from "@/lib/store/settings";
import { type MobileWalletTransactionsProps } from "./types";
import { MobileTransactionType } from "./type";
import { TransactionStatus } from "@/widgets/wallet/_shared/transactions/status";

export const TransactionItem4Mobile = ({
	transaction,
}: {
	transaction: MobileWalletTransactionsProps;
	position?: number;
}): JSX.Element => {
	const { settings } = useSettingState();

	const extractDescription = (description: string): string | undefined => {
		const matchIncludes = "Withdrawal Processed for request";
		// Check if the description includes the matchIncludes string
		if (description.includes(matchIncludes)) {
			// Extract the only `Withdrawal Processed` string from the description
			const match = description.match(/Withdrawal Processed/g);
			if (match) {
				return match[0];
			}
		}
		// Return undefined if the condition is not met
		return description;
	};
	return (
		<div className={cn("flex w-full flex-col items-start gap-2 border-b border-line bg-[#FCFCFC] px-5 py-2")}>
			<div className="flex w-full items-center justify-between">
				<span className="text-xs leading-[21px] tracking-wide text-[#898989]">
					{formatDateHandler(transaction?.date, "DD MMM YYYY")}
				</span>
				<div className="flex w-max items-center gap-[5px] text-[#303437]">
					<p className="text-xs font-medium tracking-wide">{Number(transaction?.amount)?.toFixed(6)}</p>
					<Image
						width={13}
						height={13}
						src={transaction?.coin?.icon}
						alt={transaction?.coin?.reference}
						className="rounded-full"
					/>
					<p className="text-xs font-medium tracking-wide">{transaction?.currency}</p>
					<p className="text-xs font-medium tracking-wide">({transaction?.usdValue})</p>
				</div>
			</div>
			<div className="inline-flex w-full flex-col items-start justify-start gap-4 rounded-lg text-title">
				<h4 className="line-clamp-2 self-stretch text-base font-medium leading-normal tracking-wide">
					{extractDescription(transaction?.description)}
				</h4>
			</div>
			<div className="flex w-full items-center justify-between">
				<div className="flex w-max items-center gap-2 text-zinc-500">
					<MobileTransactionType type={transaction?.type} />
					<TransactionStatus status={transaction?.status} />
				</div>
				<Link
					href={`${settings?.SNOWTRACE_URL}/tx/${transaction.transactionHash as string}`}
					target="_blank"
					className="inline-flex h-[25px] w-[29px] items-center justify-center rounded-lg border border-[#6B4EFF] bg-[#E7E7FF] px-1 py-0.5"
				>
					<ExternalLink className="relative h-[12.90px] w-[12.90px] text-[#6B4EFF]" />
				</Link>
			</div>
		</div>
	);
};
