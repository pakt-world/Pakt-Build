import moment from "moment";

import { TransformedData } from "@/widgets/wallet/desktop/_components/chart";
import { ChartData } from "../api/wallet";
import { TransactionProps } from "../types/wallet";

export const transformAndSortData = (data: ChartData[] | undefined, dateFormat: string): TransformedData[] => {
	if (!data) {
		return [];
	}

	return data
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((c) => {
			return {
				date: moment(c.date).utc().format(dateFormat),
				amt: Number(c.value || 0),
			};
		});
};

export const nTransformAndSortData = (data: ChartData[] | undefined): TransformedData[] => {
	if (!data) {
		return [];
	}

	return data
		.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
		.map((c) => {
			return {
				date: c.date,
				amt: Number(c.value || 0),
			};
		});
};

export const parseTransactionHash = (tx: TransactionProps): string | object => {
	if (tx.responseData !== null && tx.responseData !== undefined) {
		const response = JSON.parse(tx.responseData);
		if (response.data.tx) {
			return response.data.tx.transactionHash;
		}
	}
	return "";
};
