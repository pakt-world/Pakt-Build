import { TransactionStatus, TransactionType } from "@/lib/enums";
import { CoinProps } from "@/lib/types/collection";

export interface MobileWalletTransactionsProps {
	date: string;
	amount: string;
	description: string;
	coin: CoinProps;
	usdValue: string;
	type: TransactionType;
	status: TransactionStatus;
	transactionHash: string;
	currency: string;
}
