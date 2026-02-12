import { TransactionStatus, TransactionType } from "../enums";
import { CoinProps } from "./collection";

export interface TransactionProps {
	amount: number;
	chain: string;
	coin: CoinProps;
	createdAt: string;
	currency: string;
	description: string;
	method: string;
	owner: string;
	rate: string;

	responseData: string;

	status: TransactionStatus;
	type: TransactionType;
	updatedAt: string;
	usdValue: number;
	_id: string;
}

export type I0xType = `0x${string}`;
