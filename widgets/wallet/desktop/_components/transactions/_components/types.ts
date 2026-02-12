/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type TransactionStatus as TransactionStatusEnums,
	type TransactionType as TransactionTypeEnums,
} from "@/lib/enums";

export interface WalletTransactionsProps {
	date: string;
	amount: string;
	description: string;
	usdValue: string;
	type: {
		type: TransactionTypeEnums;
		coin: {
			_id: string;
			icon: string;
			reference: string;
		};
	};
	status: TransactionStatusEnums;
	transactionHash: string;
}
