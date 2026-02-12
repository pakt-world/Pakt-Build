/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import {
	type QueryKey,
	useQuery,
	type UseQueryOptions,
	type UseQueryResult,
	type UseInfiniteQueryResult,
	useInfiniteQuery,
} from "@tanstack/react-query";
import Axios, { type AxiosResponse } from "axios";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { toast } from "@/components/common/toaster";
import { type ApiError, axios } from "@/lib/axios";
import { useWalletState } from "@/lib/store/wallet";
import { ENVS } from "@/config";
import { useExchangeRateStore } from "../../store/misc";
import { type TransactionProps } from "@/lib/types/wallet";

const REFRESH_INTERVAL = 60000;

const getWalletQueryKey: QueryKey = ["wallet-details"];
const getWalletTxQueryKey: QueryKey = ["wallet-txs"];

// fetch wallets
// const fetchWallet = async (): Promise<ApiResponse<IWallet>> => axios.get(`/wallet`);

// transactions

// single transactions
// const fetchSingleTransactions = async (id: string): Promise<void> => {
//     try {
//         const { data } = await axios.get(`/transaction/${id}`);
//         if (data?.status === "success") {
//             return data?.data;
//         }
//     } catch (error) {
//         return error?.response?.data;
//     }
// };

// single transactions

interface fetchWalletStatsParams {
	format: string;
	refetchInterval?: number;
}
export interface ChartData {
	date: string;
	value: number;
}

export const fetchWalletStats = async ({ format }: fetchWalletStatsParams): Promise<ChartData[]> => {
	const res = await axios.get(`/transaction/stats?format=${format}`);
	return res.data.data;
};

export const useFetchWalletStats = (format: fetchWalletStatsParams): UseQueryResult<ChartData[], ApiError> => {
	return useQuery({
		queryFn: async () => {
			if (format) {
				return fetchWalletStats(format);
			}
			throw new Error("No format parameter provided");
		},
		queryKey: [`wallet_starts_${JSON.stringify(format)}`],
		onError: (error: ApiError) => {
			toast.error(error.response?.data.message ?? "An error occurred");
		},
		enabled: Boolean(format),
		refetchInterval: format.refetchInterval || REFRESH_INTERVAL,
	});
};

// wallet withdrawal
// const fetchWithdrawalStats = async (payload: any) => {
//     try {
//         const { data } = await axios.post(`/withdrawals`, payload);
//         if (data?.status === "success") {
//             return data;
//         }
//     } catch (error: any) {
//         return error?.response?.data;
//     }
// };

export type ExchangeRateRecord = Record<string, number>;

export const fetchExchangeRate = async (): Promise<ExchangeRateRecord> => {
	const res = await axios.get(`/transaction/exchange`);
	return res.data.data;
};

export const fetchPublicExchangeRate = async (): Promise<ExchangeRateRecord> => {
	const res = await Axios.get(`${ENVS.NEXT_PUBLIC_SOCKET_URL}public/price`);
	return res.data.data;
};

export const useExchangeRate = ({
	enable = false,
}: {
	enable: boolean;
}): UseQueryResult<ExchangeRateRecord, ApiError> => {
	const { setData } = useExchangeRateStore();
	const getQueryExchangeKey = ["exchange-rate"];

	return useQuery({
		queryFn: fetchExchangeRate,
		queryKey: getQueryExchangeKey,
		onError: (error: ApiError) => {
			toast.error(error.response?.data.message ?? "An error fetching exchange rate");
		},
		onSuccess: (data: ExchangeRateRecord) => {
			setData(data);
		},
		enabled: enable,
	});
};
export const usePublicExchangeRate = ({
	enable = false,
}: {
	enable: boolean;
}): UseQueryResult<ExchangeRateRecord, ApiError> => {
	const { setData } = useExchangeRateStore();
	const getQueryExchangeKey = ["public-exchange-rate"];
	return useQuery({
		queryFn: fetchPublicExchangeRate,
		queryKey: getQueryExchangeKey,
		onError: (error: ApiError) => {
			toast.error(error.response?.data.message ?? "An error fetching exchange rate");
		},
		onSuccess: (data: ExchangeRateRecord) => {
			setData(data);
		},
		enabled: enable,
		refetchInterval: REFRESH_INTERVAL,
		refetchOnWindowFocus: false,
	});
};

export interface WalletProps {
	address: string;
	amount: number;
	coin: string;
	icon: string;
	id: string;
	usdValue: number;
}

export interface IWallet {
	totalBalance: number | string;
	value: string;
	wallets: WalletProps[];
}

const fetchWallet = async (): Promise<IWallet> => {
	const res = await axios.get(`/wallet`);
	// Logger.info("res", res);
	return res.data.data;
};

export const useGetWalletDetails = (data: { refreshInterval?: number }): UseQueryResult<IWallet, ApiError> => {
	const { setWallet } = useWalletState();

	const options: UseQueryOptions<IWallet, ApiError> = {
		queryFn: fetchWallet,
		queryKey: ["wallet-data-fetch"],
		onError: (error) => {
			toast.error(error.response?.data.message ?? "An error occurred");
		},
		onSuccess: (data: IWallet) => {
			setWallet(data);
		},
		refetchInterval: data?.refreshInterval ? data?.refreshInterval : REFRESH_INTERVAL,
	};

	return useQuery(getWalletQueryKey, options);
};

// ===

export interface IWalletTx {
	page: string;
	pages: string;
	limit: string;
	transactions: TransactionProps[];
}

interface ITransaction {
	limit: number;
	page: number;
	filters: Record<string, unknown>;
	refetchInterval?: number;
}

const fetchWalletTransactions = async ({ limit, page, filters }: ITransaction): Promise<AxiosResponse<IWalletTx>> => {
	const res = await axios.get(`/transaction`, {
		params: {
			page,
			limit,
			...filters,
		},
	});
	return res.data.data;
};

export const useGetWalletTxs = ({
	limit,
	page,
	filters,
	...rest
}: ITransaction): UseQueryResult<IWalletTx, ApiError<null>> => {
	const options: UseQueryOptions<IWalletTx, ApiError<null>> = {
		// @ts-expect-error ---
		queryFn: async () => {
			return fetchWalletTransactions({ limit, page, filters });
		},
		queryKey: ["wallet-tx-q", limit, page],
		onError: (error) => {
			toast.error(error.response?.data.message ?? "An error occurred");
		},
		enabled: true,
		refetchInterval: rest?.refetchInterval || REFRESH_INTERVAL,
	};

	return useQuery(getWalletTxQueryKey, options);
};

export const useGetWalletTxsInfinitely = ({
	limit,
	page,
	filters,
	...rest
}: ITransaction): UseInfiniteQueryResult<IWalletTx, ApiError<null>> => {
	return useInfiniteQuery(
		[`wallet-txs_${page}_${limit}`],
		async ({ pageParam = 1 }) => fetchWalletTransactions({ limit, page: pageParam, filters }),
		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			enabled: true,
			refetchInterval: rest.refetchInterval || REFRESH_INTERVAL,
		}
	);
};
// ===

export interface PaymentCoinsProps {
	_id: string;
	name: string;
	symbol: string;
	icon: string;
	reference: string;
	decimal: string;
	isToken: boolean;
	rpcChainId: string;
	active: boolean;
	priceTag?: string;
	createdAt: string;
	updatedAt: string;
	__v: number;
	contractAddress?: string;
}

const fetchPaymentCoins = async (): Promise<PaymentCoinsProps[]> => {
	const res = await axios.get(`/payment/coins`);
	return res.data.data;
};

export const useGetPaymentCoins = ({
	enable = false,
}: {
	enable: boolean;
}): UseQueryResult<PaymentCoinsProps[], ApiError> => {
	const getQueryIdKey = ["payment-coin"];
	return useQuery({
		queryFn: fetchPaymentCoins,
		queryKey: getQueryIdKey,
		onError: (error: ApiError) => {
			toast.error(error.response?.data.message ?? "An error fetching talents occurred");
		},
		enabled: enable,
	});
};

// ===

export interface ActiveRPCProps {
	rpcName: string;
	rpcChainId: string;
	rpcUrls: string[];
	blockExplorerUrls: string[];
}

const fetchRPCServer = async (): Promise<ActiveRPCProps> => {
	const res = await axios.get(`/payment/rpc`);
	return res.data.data;
};

export const useGetActiveRPC = (): UseQueryResult<ActiveRPCProps, unknown> => {
	const getQueryIdKey = ["active-rpc"];
	return useQuery({
		queryFn: fetchRPCServer,
		queryKey: getQueryIdKey,
		onError: (error: ApiError) => {
			toast.error(error.response?.data.message ?? "An error fetching talents occurred");
		},
	});
};
